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

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const uploadResult = await firebaseAppDistribution.uploadAndDistribute({
    appId: "1:471512247705:android:953e17e138b6f81c423708",
    binaryPath: "./app-debug.apk",
    fileName: "apk-debug.apk",
    testerEmails: ["tester000@fake.com"],
    groupAliases: ["test-group"],
    releaseNotes: "This is an updated test release note!",
  });

  console.log(uploadResult);
}

main();
```

Output would look like:

```json
{
  "name": "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0",
  "releaseNotes": { "text": "This is an updated test release note!" },
  "displayVersion": "1.0",
  "buildVersion": "1",
  "createTime": "2026-03-17T20:53:42.239409Z",
  "firebaseConsoleUri": "https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/6jdgi70i82gg0",
  "testingUri": "https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0",
  "binaryDownloadUri": "https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnNa6vN19pAdGTUmlvh7-sPEq34NSE3E9sWMatNCyrgrIe_5EvDe0_dKvRGfTQs91wDVb3uIc2LzJKb2GitXOSA7oQNLrY1D6m2FPUo6sDHV4qKajiOrdJe1zhTTFrUnwMgWSCmdmf6NUSkaB8wcHV_q2dPNlWsJWOe1cjfopIO5JHzIQg90WhOR_hgxUCXZZjrGsYGLBC5v2tUJWAB_dKI0GrvkKD5af19uOQra88KnqOMu62XMgtvsH1uDcSJWmbIXkSSa-D3qQ6PN_tGnCD6jOj6LWwlWXdAJT6mr3BrUufKeIDe1iS-xAXC4u7luEm-1WGoOhhRbFEstR06aBR0nmc",
  "updateTime": "2026-03-17T20:53:46.970572Z",
  "expireTime": "2026-08-14T20:53:42.239409Z"
}
```

## Method references

FirebaseAppDistribution

<ul>
  <li>uploadAndDistribute() - Uploads and distributes a release.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const uploadResult = await firebaseAppDistribution.uploadAndDistribute({
    appId: "1:471512247705:android:953e17e138b6f81c423708",
    binaryPath: "./app-debug.apk",
    fileName: "apk-debug.apk",
    testerEmails: ["tester000@fake.com"],
    groupAliases: ["test-group"],
    releaseNotes: "This is an updated test release note!",
  });

  console.log(uploadResult);
  // sample output
  // {
  //   "name": "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0",
  //   "releaseNotes": { "text": "This is an updated test release note!" },
  //   "displayVersion": "1.0",
  //   "buildVersion": "1",
  //   "createTime": "2026-03-17T20:53:42.239409Z",
  //   "firebaseConsoleUri": "https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/6jdgi70i82gg0",
  //   "testingUri": "https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0",
  //   "binaryDownloadUri": "https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/6jdgi70i82gg0/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnNa6vN19pAdGTUmlvh7-sPEq34NSE3E9sWMatNCyrgrIe_5EvDe0_dKvRGfTQs91wDVb3uIc2LzJKb2GitXOSA7oQNLrY1D6m2FPUo6sDHV4qKajiOrdJe1zhTTFrUnwMgWSCmdmf6NUSkaB8wcHV_q2dPNlWsJWOe1cjfopIO5JHzIQg90WhOR_hgxUCXZZjrGsYGLBC5v2tUJWAB_dKI0GrvkKD5af19uOQra88KnqOMu62XMgtvsH1uDcSJWmbIXkSSa-D3qQ6PN_tGnCD6jOj6LWwlWXdAJT6mr3BrUufKeIDe1iS-xAXC4u7luEm-1WGoOhhRbFEstR06aBR0nmc",
  //   "updateTime": "2026-03-17T20:53:46.970572Z",
  //   "expireTime": "2026-08-14T20:53:42.239409Z"
  // }
}

main();
```

</details>

  <li>testers
    <ul>
      <li>add() - Adds the specified emails to the testers list.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const testers = await firebaseAppDistribution.testers.add([
    "tester_001@fake.com",
  ]);

  console.log(testers);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/testers/tester_001@fake.com',
  //     email: 'tester_001@fake.com'
  //   }
  // ]
}

main();
```

</details>
      <li>remove() - Removes the specified emails from the testers list.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const testers = await firebaseAppDistribution.testers.remove([
    "tester_001@fake.com",
  ]);

  console.log(testers);
  // sample output
  // [ 'tester_001@fake.com' ]
}

main();
```

</details>
      <li>list() - Lists testers.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const testers = await firebaseAppDistribution.testers.list();

  console.log(testers);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/testers/group_tester000@fake.com',
  //     groups: [ 'projects/471512247705/groups/test-group' ],
  //     lastActivityTime: '2026-03-16T21:41:47.126529Z',
  //     email: 'group_tester000@fake.com'
  //   },
  //   {
  //     name: 'projects/471512247705/testers/tester000@fake.com',
  //     lastActivityTime: '2026-03-16T21:41:38.783343Z',
  //     email: 'tester000@fake.com'
  //   },
  //   {
  //     name: 'projects/471512247705/testers/tester_000@fake.com',
  //     lastActivityTime: '2026-03-16T22:17:44.384017Z',
  //     email: 'tester_000@fake.com'
  //   }
  // ]

  const testersInTestGroup = await firebaseAppDistribution.testers.list({
    groups: ["test-group"],
  });

  console.log(testersInTestGroup);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/testers/group_tester000@fake.com',
  //     groups: [ 'projects/471512247705/groups/test-group' ],
  //     lastActivityTime: '2026-03-16T21:41:47.126529Z',
  //     email: 'group_tester000@fake.com'
  //   }
  // ]
}

main();
```

</details>
      <li>get() - Gets a specific tester.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const tester = await firebaseAppDistribution.testers.get(
    "group_tester000@fake.com",
  );

  console.log(tester);
  // sample output
  // {
  //   name: 'projects/471512247705/testers/group_tester000@fake.com',
  //   groups: [ 'projects/471512247705/groups/test-group' ],
  //   lastActivityTime: '2026-03-16T21:41:47.126529Z',
  //   email: 'group_tester000@fake.com'
  // }
}

main();
```

</details>
      <li>update() - Updates a tester.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const tester = await firebaseAppDistribution.testers.update(
    "tester000@fake.com",
    {
      displayName: "Tester Display Name",
      groups: ["test-group"],
    },
  );

  console.log(tester);
  // sample output
  // {
  //   name: 'projects/471512247705/testers/tester000@fake.com',
  //   displayName: 'Tester Display Name',
  //   groups: [ 'projects/471512247705/groups/test-group' ],
  //   lastActivityTime: '2026-03-16T21:41:38.783343Z',
  //   email: 'tester000@fake.com'
  // }
}

main();
```

</details>
    </ul>
  </li>
  <br>
  <li>groups
    <ul>
      <li>create() - Creates a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const group = await firebaseAppDistribution.groups.create(
    "Group Display Name",
    "group-id",
  );

  console.log(group);
  // sample output
  // {
  //   name: 'projects/471512247705/groups/group-id',
  //   displayName: 'Group Display Name',
  //   id: 'group-id'
  // }
}

main();
```

</details>
      <li>delete() - Deletes a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const response = await firebaseAppDistribution.groups.delete("group-id");

  console.log(response);
  // sample output is an empty object on success
  // {}
}

main();
```

</details>
      <li>get() - Gets a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const group = await firebaseAppDistribution.groups.get("test-group");

  console.log(group);
  // sample output
  // {
  //   name: 'projects/471512247705/groups/test-group',
  //   displayName: 'test-group',
  //   testerCount: 2,
  //   releaseCount: 1,
  //   id: 'test-group'
  // }
}

main();
```

</details>
      <li>list() - Lists groups.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const groups = await firebaseAppDistribution.groups.list();

  console.log(groups);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/groups/group-id',
  //     displayName: 'Group Display Name',
  //     id: 'group-id'
  //   },
  //   {
  //     name: 'projects/471512247705/groups/test-group',
  //     displayName: 'test-group',
  //     testerCount: 2,
  //     releaseCount: 1,
  //     id: 'test-group'
  //   }
  // ]
}

main();
```

</details>
      <li>update() - Updates a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const group = await firebaseAppDistribution.groups.update("group-id", {
    displayName: "New dispay name",
  });

  console.log(group);
  // sample output
  // {
  //   name: 'projects/471512247705/groups/group-id',
  //   displayName: 'New dispay name',
  //   id: 'group-id'
  // }
}

main();
```

</details>
      <li>removeTesters() - Removes testers from a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const response = await firebaseAppDistribution.groups.removeTesters(
    "group-id",
    ["tester000@fake.com"],
  );

  console.log(response);
  // sample output is an empty object on success
  // {}
}

main();
```

</details>
      <li>addTesters() - Adds testers to a group.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const response = await firebaseAppDistribution.groups.addTesters("group-id", [
    "tester000@fake.com",
    "tester001@fake.com",
  ]);

  console.log(response);
  // sample output is an empty object on success
  // {}
}

main();
```

</details>
    </ul>
  </li>
  <br>
  <li>releases
    <ul>
      <li>upload() - Uploads a release.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const uploadResult = await firebaseAppDistribution.releases.upload(
    "1:471512247705:android:953e17e138b6f81c423708",
    "./app-debug.apk",
    "apk-debug.apk",
  );

  console.log(uploadResult);
  // sample output
  // {
  //   name: 'projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/-/operations/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a'
  // }
}

main();
```

</details>
      <li>delete() - Deletes releases.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const response = await firebaseAppDistribution.releases.delete(
    "1:471512247705:android:953e17e138b6f81c423708",
    [
      "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/19up3cdpmbps8",
    ],
  );

  console.log(response);
  // sample output is an empty object on success
  // {}
}

main();
```

</details>
      <li>distribute() - Distributes a release.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const releaseData = await firebaseAppDistribution.releases.distribute(
    "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0",
    {
      testerEmails: ["tester000@fake.com"],
    },
  );

  console.log(releaseData);
  // sample output is empty object on success
  // {}
}

main();
```

</details>
      <li>get() - Gets a release.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const releaseData = await firebaseAppDistribution.releases.get(
    "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0",
  );

  console.log(releaseData);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0',
  //     displayVersion: '1.0',
  //     buildVersion: '1',
  //     createTime: '2026-03-17T22:32:47.783475Z',
  //     firebaseConsoleUri: 'https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/0b6cob86n2tc0',
  //     testingUri: 'https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0',
  //     binaryDownloadUri: 'https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnk1ZzSwXSXBozsb2Sd3LKvG0yvdetjahsh0DF1YiBYIiguwSnQEdPoC8ee_y2eNpRN0e2vc1hUViHeUbQ7glyPYyk8zxLBtzV_boEsxDBJXXtDL3Siem4jadJgTV18vH55ulJmOAG0k71BwEa9Un1WjQoeMMn9UF_1S-YXC2oLZzw7IODcfbSPJ-cvJn5zbFiyjRRUUpavUdZoy6atkAnvmGeTwPi0mHT7cJtvgD2M8F5a8k-BF3xOKPvmdfLGaNf11vl5PvHqwom2zDXwBAUWGDHt_Nx5OcIJP2NkyORZq22cc0n51u8hE6jEjO-bHBjAMMGvixLQKijdZVhKRoYamTw',
  //     updateTime: '2026-03-17T22:32:47.829991Z',
  //     expireTime: '2026-08-14T22:32:47.783475Z'
  //   }
  // ]
}

main();
```

</details>
      <li>list() - Lists releases.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const releases = await firebaseAppDistribution.releases.list(
    "1:471512247705:android:953e17e138b6f81c423708",
  );

  console.log(releases);
  // sample output
  // [
  //   {
  //     name: 'projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/19up3cdpmbps8',
  //     displayVersion: '1.0',
  //     buildVersion: '1',
  //     createTime: '2026-03-17T22:22:45.185232Z',
  //     firebaseConsoleUri: 'https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/19up3cdpmbps8',
  //     testingUri: 'https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/19up3cdpmbps8',
  //     binaryDownloadUri: 'https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/19up3cdpmbps8/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnjOYV6UokWhDWyQ3VHjZ_vKPJlKpTqJ8pf1jqNk5KKTxY9APNDl-jjFQa2d2PS1HA8Wh9p7smfsfPV0qk5hkk3DspuAKHtZLFyk5HVKLK8jwHOweeeu-IMxYN3fiYKLQf1tzk1i5qBYudy3MTrU61MnZBallLXArFsRlyMJC6ssW1l2uvTGYEJVczgk0D-NwKUT7pFjwoHyfCPQiyuhH04l-w7rilHOLzsStI1NMUVAqTEKF4ZCeAIOAJwCVly_NCRnQKBLLt7rbIFEVLjAP5RJl048d8Puglg9MxYCWtVDa3ZJrikvVULHGneNUIvJgXph25K5uezcfpreOE-dZl6CMo',
  //     updateTime: '2026-03-17T22:22:45.228936Z',
  //     expireTime: '2026-08-14T22:22:45.185232Z'
  //   }
  // ]
}

main();
```

</details>
      <li>addReleaseNotes() - Adds release notes.</li>

<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const releaseData = await firebaseAppDistribution.releases.addReleaseNotes(
    "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0",
    "This is test release notes!!!",
  );

  console.log(releaseData);
  // sample output
  // {
  //   name: 'projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0',
  //   releaseNotes: { text: 'This is test release notes!!!' },
  //   displayVersion: '1.0',
  //   buildVersion: '1',
  //   createTime: '2026-03-17T22:32:47.783475Z',
  //   firebaseConsoleUri: 'https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/0b6cob86n2tc0',
  //   testingUri: 'https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0',
  //   binaryDownloadUri: 'https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnnY1PeW_MvMsri-b8s8txIlgW7Vt6xLudBQEoEe4vLOsNr6waIbKa6P8Y9x79eDL5fA1wjSZxPq2VBCE1t6hNyVgkDUrqGP2siylFU5HSRWXkVKqIlitLce9ISyi92E2jT8xyrZRH68FbUjg7h__UVDkWU9aCqSNRC40v1Gw97Fuu6-bqSIVunhq4g6HSPaLP8S8W4z-5q8PopGZCMqMQrMDOyq03n5cPJDLGm9MYVLJgl-NavkuHTmEUf8-IWryxbDiaxTtbvm9_IxK1eOQvHBgH9fZqcjUycXs9I9cxu5IfqgwJ9t5_gy8Otup142b3eyK9SpchpcrACwYlXJGtUYuA',
  //   updateTime: '2026-03-17T22:44:35.695762Z',
  //   expireTime: '2026-08-14T22:32:47.783475Z'
  // }
}

main();
```

</details>
      <li>operations
        <ul>
          <li>get() - Gets the status of an operation.</li>
<details>
<summary>sample usage</summary>

```js
import { FirebaseAppDistribution } from "firebase-app-distribution";

async function main() {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "../service-account.json",
  });

  const operationData = await firebaseAppDistribution.releases.operations.get(
    "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/-/operations/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a",
  );

  console.log(JSON.stringify(operationData, null, 2));
  // sample output
  // {
  //   "name": "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/-/operations/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a",
  //   "done": true,
  //   "response": {
  //     "@type": "type.googleapis.com/google.firebase.appdistro.v1.UploadReleaseResponse",
  //     "result": "RELEASE_CREATED",
  //     "release": {
  //       "name": "projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0",
  //       "releaseNotes": {
  //         "text": "This is test release notes!!!"
  //       },
  //       "displayVersion": "1.0",
  //       "buildVersion": "1",
  //       "createTime": "2026-03-17T22:32:47.783475Z",
  //       "firebaseConsoleUri": "https://console.firebase.google.com/project/app-distribution-testproj/appdistribution/app/android:com.example.app/releases/0b6cob86n2tc0",
  //       "testingUri": "https://appdistribution.firebase.google.com/testerapps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0",
  //       "binaryDownloadUri": "https://firebaseappdistribution.googleapis.com/app-binary-downloads/projects/471512247705/apps/1:471512247705:android:953e17e138b6f81c423708/releases/0b6cob86n2tc0/binaries/b3745e27ddfae29b57d92ed3ca26fd91bce387b599af3b315ae52fab4fbf8c2a/app.apk?token=AP0lV28AAAAAabnoA5WHVRqpgHj_33-xmlxekD-kAfCAbG8e6i0CAzInlxQQntAaUp-1suAUgPUMADw4fQwhPhVO1rqHw0aZB-VEARkZjRiGOkaPxd8vgo5SwgTPAoSx_REcQiEXRXhohqt5-l_0yYwXTO4Tp6P1RLsKg6BQBaH6g-W4fxHrz2SL-Bb4lqaeS2v83lWQ579KBotMb82cYnxpixNQuQKNJYqKY6DX2j0onCnEkeM0tM5-Zz9HfF2IXtH7W6vz5g9hS4yBaNV6dz0zRxcoMLT7bCTfUs8akTki3be2C0su9Z_j2dLHGGr990AYlwH6NvNiSjcvOvVghUm-EwEhm01wzMcIu3E",
  //       "updateTime": "2026-03-17T22:44:35.695762Z",
  //       "expireTime": "2026-08-14T22:32:47.783475Z"
  //     }
  //   }
  // }
}

main();
```

</details>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
