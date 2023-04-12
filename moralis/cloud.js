const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.beforeDelete(Moralis.User, async (req) => {
  const r = await req;

  const ethAddressQuery = new Moralis.Query("_EthAddress");
  ethAddressQuery.equalTo("user", r.object);
  const addresses = await ethAddressQuery.find({ useMasterKey: true });

  for (let addr of addresses) {
    await addr
      .destroy({ useMasterKey: true })
      .then((res) => {
        logger.info("Deleted user _EthAddress: " + JSON.stringify(res));
      })
      .catch((error) => {
        logger.error(
          "Error deleting user _EthAddress: " + JSON.stringify(error)
        );
        throw error;
      });
  }

  const sessionQuery = new Moralis.Query("_Session");
  sessionQuery.equalTo("user", r.object);
  const sessions = await sessionQuery.find({ useMasterKey: true });

  for (let sess of sessions) {
    await sess
      .destroy({ useMasterKey: true })
      .then((res) => {
        logger.info("Deleted user _Session: " + JSON.stringify(res));
      })
      .catch((error) => {
        logger.error("Error deleting user _Session: " + JSON.stringify(error));
        throw error;
      });
  }

  const paymentAddressQuery = new Moralis.Query("PaymentAddress");
  paymentAddressQuery.equalTo("user", r.object);
  const payments = await paymentAddressQuery.find({ useMasterKey: true });

  for (let payment of payments) {
    await payment
      .destroy({ useMasterKey: true })
      .then((res) => {
        logger.info("Deleted user PaymentAddress: " + JSON.stringify(res));
      })
      .catch((error) => {
        logger.error(
          "Error deleting user PaymentAddress: " + JSON.stringify(error)
        );
        throw error;
      });
  }
});

Moralis.Cloud.define("findUser", async (req) => {
  const address = req.user.attributes.ethAddress;
  const query = new Moralis.Query("AddressesFromPreviousSubmissions");
  query.equalTo("addresses", address);
  query.notEqualTo("confirmed", true);
  query.select("handle");

  const matchedUsers = await query.find({ useMasterKey: true });
  return matchedUsers.map((user) => user.attributes.handle);
});

Moralis.Cloud.define("checkHandleAgainstPreviousSubmissions", async (req) => {
  // check that an address associated with the username from previous submissions matches
  // the address that corresponds to the moralis id in the database
  const { username, moralisId, polygonAddress } = req.params;

  const submissionsQuery1 = new Moralis.Query(
    "AddressesFromPreviousSubmissions"
  );
  submissionsQuery1.equalTo("handle", username);
  const submissions = await submissionsQuery1.find({ useMasterKey: true });
  if (submissions.length < 1) {
    // this is a user who has not previously submitted findings
    return;
  }

  const submissionsQuery2 = new Moralis.Query(
    "AddressesFromPreviousSubmissions"
  );
  submissionsQuery2.equalTo("handle", username);
  submissionsQuery2.equalTo("addresses", polygonAddress);
  const submissions2 = await submissionsQuery2.find({ useMasterKey: true });
  if (submissions2.length < 1) {
    throw `The username ${username} is not associated with the address ${polygonAddress}`;
  }

  const userQuery = new Moralis.Query("_User");
  userQuery.equalTo("objectId", moralisId);
  userQuery.equalTo("accounts", polygonAddress);
  const user = await userQuery.find({ useMasterKey: true });
  if (user.length < 1) {
    throw "The address does not match with the user who made the request";
  }
});

Moralis.Cloud.define("confirmUser", async (req) => {
  const { sessionToken, username, moralisId } = req.params;

  const sessionQuery = new Moralis.Query("_Session");
  sessionQuery.equalTo("sessionToken", sessionToken);

  const userQuery = new Moralis.Query("_User");
  userQuery.equalTo("username", username);
  userQuery.equalTo("objectId", moralisId);

  sessionQuery.matchesQuery("user", userQuery);
  const result = await sessionQuery.find({ useMasterKey: true });
  return result.length > 0;
});

Moralis.Cloud.define("resetPassword", async (req) => {
  const { email } = req.user.attributes;
  if (!email) {
    throw "You must have an email address saved to reset your password";
  }
  Moralis.User.requestPasswordReset(email);
});

Moralis.Cloud.define("addPaymentAddress", async (req) => {
  const chain = req.params.chain;
  const address = req.params.address;
  const PaymentAddress = Moralis.Object.extend("PaymentAddress");
  const newAddress = new PaymentAddress();
  newAddress.setACL(new Moralis.ACL(req.user));
  await newAddress.save(
    { chain, address, user: req.user },
    { useMasterKey: true }
  );
  return newAddress;
});

// Ensure each user only has one payment address for each chain
Moralis.Cloud.beforeSave("PaymentAddress", async (req) => {
  if (!req.original) {
    const user = req.object.get("user");
    const chain = await req.object.get("chain");

    const query = new Moralis.Query("PaymentAddress");
    query.equalTo("chain", chain);
    query.equalTo("user", user);
    const results = await query.find({ useMasterKey: true });

    if (results.length > 0) {
      throw `User already has a ${chain} payment address saved`;
    }
  }
});
