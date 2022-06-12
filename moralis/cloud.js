Moralis.Cloud.beforeSave(Moralis.User, async (req) => {
  const c4Username = await req.object.get("c4Username");
  if (!req.original) {
    // expect username to be undefined when user is first created
    if (c4Username !== undefined) {
      throw "users must register through the code4rena website";
    }
  } else {
    const previousUsername = await req.original.get("c4Username");
    // if updated username is not different from previous username, skip validation
    if (previousUsername !== c4Username) {
      if (previousUsername && !c4Username) {
        throw "You cannot delete your username";
      }

      const query = new Moralis.Query("_User");
      query.equalTo("c4Username", c4Username);
      const result = await query.find({ useMasterKey: true });

      if (result.length > 0) {
        throw `There is already a registered user with the username ${c4Username}`;
      }
    }
  }
});

Moralis.Cloud.define("findUser", async (req) => {
  const address = req.user.attributes.ethAddress;
  const query = new Moralis.Query("AddressesFromPreviousSubmissions");
  query.equalTo("addresses", address);
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

Moralis.Cloud.define("getWardensWithSubmissions", async (req) => {
  const query = new Moralis.Query("AddressesFromPreviousSubmissions");
  query.limit(1000);
  query.select("handle");
  const allUsers = await query.find({ useMasterKey: true });
  return allUsers.map((user) => user.attributes.handle);
});

Moralis.Cloud.define("confirmUser", async (req) => {
  const { sessionToken, username, moralisId } = req.params;

  const sessionQuery = new Moralis.Query("_Session");
  sessionQuery.equalTo("sessionToken", sessionToken);

  const userQuery = new Moralis.Query("_User");
  userQuery.equalTo("c4Username", username);
  userQuery.equalTo("objectId", moralisId);

  sessionQuery.matchesQuery("user", userQuery);
  const result = await sessionQuery.find({ useMasterKey: true });
  return result.length > 0;
});
