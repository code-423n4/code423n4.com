import React, { ReactNode } from "react";
import { Input } from "./Input";

import * as styles from "./form/Form.module.scss";
import * as widgetStyles from "./reporter/widgets/Widgets.module.scss";

interface RegistrationFormCommonFieldsProps {
  username: string;
  discordUsername: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  gitHubUsername: string;
  link?: string | undefined;
  avatar?: File | null | undefined;
  avatarInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAvatar: () => void;
  usernameValidator: (value: string) => (string | ReactNode)[];
  discordUsernameValidator: (value: string) => (string | ReactNode)[];
  passwordValidator: (value: string) => (string | ReactNode)[];
  confirmPasswordValidator: (value: string) => (string | ReactNode)[];
  submitted: boolean;
}

export default function RegistrationFormCommonFields({
  username,
  discordUsername,
  emailAddress,
  password,
  confirmPassword,
  gitHubUsername,
  link,
  avatar,
  avatarInputRef,
  handleChange,
  handleAvatarChange,
  removeAvatar,
  usernameValidator,
  discordUsernameValidator,
  passwordValidator,
  confirmPasswordValidator,
  submitted,
}: RegistrationFormCommonFieldsProps) {
  return (
    <>
      <Input
        label="Code4rena Username"
        required={true}
        helpText={
          <>
            <strong className={styles.Heading4}>
              Choose wisely! Your username cannot be changed later.
            </strong>
            <br />
            Used to report findings, as well as display your total award amount
            on the leaderboard. Supports alphanumeric characters, underscores,
            and hyphens.
            <br />
            (Note: for consistency, please ensure your server nickname in our
            Discord matches the username you provide here)
          </>
        }
        name="username"
        placeholder="Username"
        value={username}
        handleChange={handleChange}
        maxLength={25}
        validator={usernameValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Discord Username"
        required={true}
        name="discordUsername"
        helpText="Used in case we need to contact you about your submissions or winnings."
        placeholder="Warden#1234"
        value={discordUsername}
        handleChange={handleChange}
        validator={discordUsernameValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Email Address"
        required={true}
        helpText="Used for sending confirmation emails for each of your submissions."
        name="emailAddress"
        placeholder="warden@email.com"
        value={emailAddress}
        handleChange={handleChange}
        forceValidation={submitted === true}
      />
      <Input
        label="Password"
        required={true}
        name="password"
        placeholder="Password"
        type="password"
        value={password}
        handleChange={handleChange}
        validator={passwordValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Confirm Password"
        required={true}
        name="confirmPassword"
        placeholder="Password"
        type="password"
        value={confirmPassword}
        handleChange={handleChange}
        validator={confirmPasswordValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="GitHub Username"
        required={false}
        helpText="Used in case we need to give you access to certain repositories."
        name="gitHubUsername"
        placeholder="Username"
        value={gitHubUsername}
        handleChange={handleChange}
      />
      <Input
        label="Link"
        required={false}
        helpText="Link your leaderboard entry to a personal website or social media account."
        name="link"
        placeholder="https://twitter.com/code4rena"
        value={link || ""}
        handleChange={handleChange}
      />
      <label htmlFor="avatar" className={widgetStyles.Label}>
        Avatar (Optional)
      </label>
      <p className={widgetStyles.Help}>
        An avatar displayed next to your name on the leaderboard.
      </p>
      <input
        className={widgetStyles.Avatar}
        type="file"
        id="avatar"
        name="avatar"
        accept=".png,.jpg,.jpeg,.webp"
        // @ts-ignore // @todo: fix typescript error
        ref={avatarInputRef}
        onChange={handleAvatarChange}
      />
      {avatar && (
        <button
          className="remove-line-button"
          type="button"
          onClick={removeAvatar}
          aria-label="Remove avatar"
        >
          &#x2715;
        </button>
      )}
    </>
  );
}
