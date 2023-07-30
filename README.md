# Firebase App Distibution [![npm](https://img.shields.io/npm/v/firebase-app-distribution)](https://www.npmjs.com/package/firebase-app-distribution) [![npm](https://img.shields.io/npm/dt/firebase-app-distribution)](https://www.npmjs.com/package/firebase-app-distribution?activeTab=versions)

A NodeJS library used to access [Firebase App Distribution APIs](https://firebase.google.com/docs/reference/app-distribution/rest).

## Pre-requisites

1. A service account with permission to access the API.
   - `Firebase App Distribution Admin` role should suffice.

## How to use

1. Create a service account.
   1. Follow steps here to [create a service account](https://cloud.google.com/iam/docs/service-accounts-create#creating).
   1. Select the `Console` tab.
   1. When selecting a role, under `Firebase App Distribution Admin`.
1. Download the service account keys.
   - Follow the steps here to [download the service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating).

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function testGetTestersApi() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: "<PROJECT_NUMBER>",
    credentials: {
      type: "service_account",
      project_id: "<PROJECT_ID>",
      private_key_id: "<PRIVATE_KEY_ID>",
      private_key: "<PRIVATE_KEY>",
      client_email: "<CLIENT_EMAIL>",
      client_id: "<CLIENT_ID>",
      auth_uri: "<AUTH_URI>",
      token_uri: "<TOKEN_URI>",
      auth_provider_x509_cert_url: "<AUTH_PROVIDER_X509_CERT_URL>",
      client_x509_cert_url: "<CLIENT_X509_CERT_URL>",
      universe_domain: "<UNIVERSE_DOMAIN>",
    },
  });
  const testers = await firebaseAppDistribution.testers.list();
  console.log(testers);
}

testGetTestersApi();
```

Output would look like:

```json
[
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester000@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester001@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester002@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester003@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester004@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester005@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester006@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester007@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester008@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  },
  {
    "name": "projects/<PROJECT_NUMBER>/testers/tester009@gmail.com",
    "lastActivityTime": "2023-07-30T13:16:24.259081Z"
  }
]
```

## Method references

FirebaseAppDistribution

<ul>
  <li>getAccessToken() - Gets the access token that is used to authenticate requests.</li>
  <li>testers</li>
    <ul>
      <li>add() - Adds the specified emails to the testers list.</li>
      <li>remove() - Removes the specified emails from the testers list.</li>
      <li>list() - Lists testers.</li>
      <li>get() - Get a specific tester.</li>
    </ul>
  </li>
  <br>
  <li>groups</li>
    <ul>
      <li>create() - Creates a group.</li>
      <li>delete() - Deletes a group.</li>
      <li>get() - Get a group.</li>
      <li>list() - List a group.</li>
      <li>removeTesters() - Removes testers from a group.</li>
      <li>addTesters() - Adds testers to a group.</li>
    </ul>
</ul>
