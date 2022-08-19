import clsx from "clsx";
import { Link } from "gatsby";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";

// types
import { PaymentAddress } from "../../types/user";

// hooks
import useUser from "../hooks/UserContext";

// components
import { Input } from "../components/Input";
import ProtectedPage from "../components/ProtectedPage";

// styles
import * as styles from "../components/form/Form.module.scss";
import * as inputStyles from "../components/Input.module.scss";
import { useModalContext } from "../hooks/ModalContext";

const initialState = {
  discordUsername: "",
  gitHubUsername: "",
  email: "",
  polygonAddress: "",
  ethereumAddress: "",
};

const initialPaymentAddressesState = {
  polygonAddress: { address: "", id: "", chain: "polygon" },
  ethereumAddress: { address: "", id: "", chain: "ethereum" },
};

export default function ConfirmAccount() {
  // hooks
  const { isInitialized, isInitializing, user, Moralis } = useMoralis();
  const { currentUser, reFetchUser } = useUser();
  const { showModal } = useModalContext();

  // state
  const [state, setState] = useState<Record<string, string>>(initialState);
  const [authAddresses, setAuthAddresses] = useState<string[]>([]);
  const [storedPaymentAddresses, setStoredPaymentAddresses] = useState<
    Record<string, PaymentAddress>
  >(initialPaymentAddressesState);

  const initializeUserInfo = async (): Promise<void> => {
    const { discordUsername, gitHubUsername, emailAddress } = currentUser;
    const accounts = await user!.get("accounts");
    setAuthAddresses(accounts || []);

    const userQuery = new Moralis.Query("_User");
    userQuery.equalTo("objectId", currentUser.moralisId);

    const query = new Moralis.Query("PaymentAddress");
    query.matchesQuery("user", userQuery);
    const results = await query.find();
    const paymentAddresses = results.map((res) => {
      return {
        address: res.attributes.address,
        chain: res.attributes.chain,
        id: res.id,
      };
    });
    const polygonAddress =
      paymentAddresses.find((address) => address.chain === "polygon") ||
      initialPaymentAddressesState.polygonAddress;
    const ethereumAddress =
      paymentAddresses.find((address) => address.chain === "ethereum") ||
      initialPaymentAddressesState.ethereumAddress;
    setStoredPaymentAddresses({ polygonAddress, ethereumAddress });
    setState({
      polygonAddress: polygonAddress?.address,
      ethereumAddress: ethereumAddress?.address,
      discordUsername,
      gitHubUsername,
      email: emailAddress,
    });
  };

  useEffect(() => {
    if (!isInitialized || !user) {
      return;
    }
    initializeUserInfo();
  }, [currentUser, isInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateDiscordUsername = (value) => {
    const discordUsernameRegex = new RegExp(/.*#[0-9]{4}/, "g");
    const isValid = discordUsernameRegex.test(value);
    if (!isValid) {
      return [
        "Make sure you enter your discord username, " +
          "and not your server nickname. It should end with '#' " +
          "followed by 4 digits.",
      ];
    }
    return [];
  };

  const validatePaymentAddress = (): (string | ReactNode)[] => {
    // @todo: write validation for addresses
    return [];
  };

  const handleSaveUserInfo = async (fieldName: string, value: string) => {
    if (!user) {
      return;
    }

    user.set(fieldName, value);
    try {
      await user.save();
      await reFetchUser();
      toast.success("Your information has been saved");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Your changes have not been saved");
      resetValue(fieldName);
    }
  };

  const handleSavePaymentAddress = useCallback(
    async (fieldName: string, newValue: string): Promise<void> => {
      const paymentAddress = storedPaymentAddresses[fieldName];
      if (!paymentAddress.id) {
        // Create a new payment address
        try {
          const newAddress = await Moralis.Cloud.run("addPaymentAddress", {
            address: newValue,
            chain: paymentAddress.chain || "polygon",
          });
          toast.success(
            `Your ${paymentAddress.chain} payment address has been saved`
          );
          const newSavedAddress = {
            chain: newAddress.attributes.chain,
            id: newAddress.id,
            address: newAddress.attributes.address,
          };
          setStoredPaymentAddresses((prevState) => {
            return { ...prevState, [fieldName]: newSavedAddress };
          });
        } catch (error) {
          console.error(error);
          toast.error(
            `An error occurred and your changes have not been saved: "${error.message}"`
          );
          setState((prevState) => {
            return {
              ...prevState,
              [fieldName]: "",
            };
          });
        }
      } else {
        // Edit an existing payment address
        try {
          const query = new Moralis.Query("PaymentAddress");
          const address = await query.get(paymentAddress.id);
          address.set("address", newValue);
          await address.save();
          toast.success(
            `Your ${paymentAddress.chain} payment address has been saved`
          );
        } catch (error) {
          console.error(error);
          toast.error("An error occurred. Your changes have not been saved");
          setState((prevState) => {
            return {
              ...prevState,
              [fieldName]: paymentAddress.address,
            };
          });
        }
      }
    },
    [storedPaymentAddresses]
  );

  const resetValue = (fieldName: string): void => {
    if (!isInitialized || !user) {
      return;
    }
    setState((prevState) => {
      return { ...prevState, [fieldName]: currentUser[fieldName] };
    });
  };

  const resetPassword = () => {
    showModal({
      title: "Reset Password",
      body: "Are you sure you want to reset your password?",
      primaryButtonText: "Reset",
      primaryButtonAction: async () => {
        try {
          await Moralis.Cloud.run("resetPassword");
          toast.info(
            "An email has been sent with a link to reset your password"
          );
        } catch (error) {
          toast.error(
            `Oops...something went wrong:  ${error.message || error}`
          );
        }
      },
    });
  };

  return (
    <ProtectedPage pageTitle="My Account | Code 423n4">
      {isInitializing ? (
        // @todo: style a loading state
        <div>LOADING...</div>
      ) : (
        <div className="wrapper-main">
          <h1 className="page-header">Manage Account</h1>
          <form className={clsx(styles.Form)}>
            <h2 className={styles.Heading2}>Payment Information</h2>
            <Input
              label="Polygon Address"
              handleChange={handleChange}
              value={state.polygonAddress}
              name="polygonAddress"
              validator={validatePaymentAddress}
              toggleEdit={true}
              handleSaveInputValue={handleSavePaymentAddress}
            />
            <Input
              label="Ethereum Address"
              handleChange={handleChange}
              value={state.ethereumAddress}
              name="ethereumAddress"
              validator={validatePaymentAddress}
              toggleEdit={true}
              handleSaveInputValue={handleSavePaymentAddress}
            />
            <div className={styles.DividingLine}></div>
            <h2 className={styles.Heading2}>User Information</h2>
            <span className={inputStyles.Label}>Login Addresses</span>
            <ul className={styles.List}>
              {authAddresses.map((address) => (
                <li>{address}</li>
              ))}
            </ul>
            <Input
              label="Discord Username"
              handleChange={handleChange}
              value={state.discordUsername}
              name="discordUsername"
              required={true}
              validator={validateDiscordUsername}
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <Input
              label="Email Address"
              handleChange={handleChange}
              value={state.email}
              name="email"
              required={true}
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <Input
              label="Github Username (Optional)"
              handleChange={handleChange}
              value={state.gitHubUsername}
              name="gitHubUsername"
              toggleEdit={true}
              handleSaveInputValue={handleSaveUserInfo}
            />
            <div className={styles.ButtonsWrapper}>
              <button
                type="button"
                className="button cta-button"
                onClick={resetPassword}
              >
                Reset Password
              </button>
            </div>
            <div className={styles.DividingLine}></div>
            <h2 className={styles.Heading2}>Teams</h2>
            <p>Team Management coming soon!</p>
            <p>
              If you need help with managing your team in the meantime,{" "}
              <Link to="/help">contact us</Link>.
            </p>
            <span className={inputStyles.Label}>Your Teams:</span>
            <p>
              {(currentUser.teams || []).length === 0
                ? "You are not a member of any teams"
                : currentUser.teams.map((e) => e.username).join(", ")}
            </p>
            <div className={styles.ButtonsWrapper}>
              <Link
                to="/register-team"
                className="button cta-button centered secondary"
              >
                Create a new team
              </Link>
            </div>
          </form>
        </div>
      )}
    </ProtectedPage>
  );
}
