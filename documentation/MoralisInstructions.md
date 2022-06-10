# Create server and update env variables

Moralis allows you to create one free server. You can access the server URL and app ID by clicking "View Details" on your server in the [dasbhoard](https://admin.moralis.io/servers) and use these values to set the variables `GATSBY_MORALIS_APP_ID` and `GATSBY_MORALIS_SERVER`

# Add fields and classes

- In the `_User` class, add these fields/columns:
  - `c4Username: String`
  - `discordUsername: String`
  - `gitHubUsername: String`
  - `emailAddress: String`
  - `handlesPendingConfirmation: Array`
- Add class `AddressesFromPreviousSubmissions` with the fields:
  - `handle: String`
  - `addresses: Array`
- Optionally add your own data to `AddressesFromPreviousSubmissions`

# Update security settings

Turn off [client class creation](https://docs.moralis.io/moralis-dapp/database/security#client-class-creation)
Edit security settings in the dashboard for your server.

To update class level permissions (CLP) or protected fields, select the class you want to update and click on "Security". To update access control lists (ACL), edit the "ACL" field on an object.

- Set CLP for the `_User` class to Authenticated "read" and "write" (remove all Public permissions, as well as "add field" permission for Authenticated)
- Set CLP for `AddressesFromPreviousSubmissions` to Authenticated "read" only (remove all Public permissions, as well as permissions to "write" or "add field" for Authenticated)
- Remove all Public and Authenticated permissions for `_Session`, `_AddressSyncStatus`, `_EthAddress`, and `_Role`.

# Cloud code

See documentation [here](https://docs.moralis.io/moralis-dapp/cloud-code/cloud-functions)
You can copy the code from the file `moralis/cloud.js` and paste it into the cloud code editor as a starting point, or use the `moralis-admin-cli` tool to develop in `moralis/cloud.js` file.
