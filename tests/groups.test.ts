import { before } from "node:test";
import { Group } from "../src/groups";
import { FirebaseAppDistribution } from "../src/index";
import {
  PROJECT_ID,
  SERIVCE_ACCOUNT_PATH,
  TEST_GROUP_IDS,
  TESTER_EMAILS,
  PROJECT_NUMBER,
} from "./contants";

import { isArraySame, subArray } from "./utils";

describe("The groups endpoint", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: SERIVCE_ACCOUNT_PATH,
    projectId: PROJECT_ID,
  });

  it("Should reach list groups endpoint.", async () => {
    const response: Group[] = await firebaseAppDistribution.groups.list();
    // Just expect the endpoint to response even if there are no testers.
    expect(response.length >= 0).toBe(true);
  });

  it(`Should create a tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.create({
      displayName: TEST_GROUP_IDS[0],
      groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
    });
    expect(response.displayName).toBe(TEST_GROUP_IDS[0]);
  });

  it(`Should get the added tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response: Group | null = await firebaseAppDistribution.groups.get(
      TEST_GROUP_IDS[0] as Lowercase<string>,
    );
    expect(response!.name).toBe(
      `projects/${PROJECT_NUMBER}/groups/${TEST_GROUP_IDS[0]}`,
    );
  });

  it(`Should update the tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const updatedDisplayName = `${TEST_GROUP_IDS[0]}-updated`;
    const response = await firebaseAppDistribution.groups.update(
      TEST_GROUP_IDS[0] as Lowercase<string>,
      {
        displayName: updatedDisplayName,
      },
    );
    expect(response.displayName).toBe(updatedDisplayName);
  });

  it(`Should remove the tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response: {} = await firebaseAppDistribution.groups.delete(
      TEST_GROUP_IDS[0] as Lowercase<string>,
    );
    // Delete returns empty object on success
    expect(response).toStrictEqual({});
  });
});

describe("Behavior when groups already exists", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectId: PROJECT_ID,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should raise an 409 error when adding existing tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    await firebaseAppDistribution.groups.create({
      displayName: TEST_GROUP_IDS[0],
      groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
    });

    try {
      await firebaseAppDistribution.groups.create({
        displayName: TEST_GROUP_IDS[0],
        groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
      });
      fail("It should have errored out when creating an existing tester.");
    } catch (error: any) {
      expect(error.message).toContain("409");
    }
  }, 10_000);

  it(`Should delete the tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.delete(
      TEST_GROUP_IDS[0] as Lowercase<string>,
    );
    // Delete returns empty object on success
    expect(response).toStrictEqual({});
  });
});

describe("Test behavior when handling multiple groups.", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should add tester groups "${TEST_GROUP_IDS[0]}" -> "${TEST_GROUP_IDS[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      await firebaseAppDistribution.groups.create({
        displayName: TEST_GROUP_IDS[index],
      });
    }
  }, 15000);

  it(`Should get tester groups "${TEST_GROUP_IDS[0]}" -> "${TEST_GROUP_IDS[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      const response = await firebaseAppDistribution.groups.get(
        TEST_GROUP_IDS[index] as Lowercase<string>,
      );

      expect(response!.name).toBe(
        `projects/${PROJECT_NUMBER}/groups/${TEST_GROUP_IDS[index]}`,
      );
    }
  }, 15000);

  it(`Should delete tester groups "${TEST_GROUP_IDS[0]}" -> "${TEST_GROUP_IDS[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      await firebaseAppDistribution.groups.delete(
        TEST_GROUP_IDS[index] as Lowercase<string>,
      );
    }
  }, 15000);
});

describe("Test removing and adding of tester to groups", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should create the group "${TEST_GROUP_IDS[0]}}"to add the testers to.`, async () => {
    const response = await firebaseAppDistribution.groups.create({
      displayName: TEST_GROUP_IDS[0],
      groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
    });
    expect(response.displayName).toBe(TEST_GROUP_IDS[0]);
  });

  it(`Should add testers ${TESTER_EMAILS[0]} -> ${TESTER_EMAILS[4]} to group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.addTesters({
      groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
      emails: subArray(TESTER_EMAILS, 0, 5),
    });
    expect(response).toStrictEqual({});
  });

  it(`Should remove testers ${TESTER_EMAILS[0]} -> ${TESTER_EMAILS[4]} from group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.removeTesters({
      groupId: TEST_GROUP_IDS[0] as Lowercase<string>,
      emails: subArray(TESTER_EMAILS, 0, 5),
    });
    expect(response).toStrictEqual({});
  });

  it(`Should remove the tester group "${TEST_GROUP_IDS[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.delete(
      TEST_GROUP_IDS[0] as Lowercase<string>,
    );
    // Delete returns empty object on success
    expect(response).toStrictEqual({});
  });

  it(`Should remove testers "${TESTER_EMAILS[0]}" -> "${TESTER_EMAILS[9]}".`, async () => {
    const response: string[] = await firebaseAppDistribution.testers.remove(
      subArray(TESTER_EMAILS, 0, 5),
    );
    expect(isArraySame(response, subArray(TESTER_EMAILS, 0, 5))).toBe(true);
  });
});

describe("List endpoint pagination", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should correctly paginate groups list endpoint.`, async () => {
    for (let index = 0; index < 5; index++) {
      await firebaseAppDistribution.groups.create({
        displayName: TEST_GROUP_IDS[index],
        groupId: TEST_GROUP_IDS[index] as Lowercase<string>,
      });
    }

    const response = await firebaseAppDistribution.groups.list({
      pageSize: 2,
      maxPages: 3,
    });

    for (let index = 0; index < 5; index++) {
      await firebaseAppDistribution.groups.delete(
        TEST_GROUP_IDS[index] as Lowercase<string>,
      );
    }

    expect(response.length).toBe(5);
  }, 60_000); // this takes a while to complete given the number of requests being made, so set timeout to 1 minute.
});
