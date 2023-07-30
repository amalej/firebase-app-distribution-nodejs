import { Group } from "../src/groups";
import { FirebaseAppDistribution } from "../src/index";
import {
  PROJECT_NUMBER,
  SERIVCE_ACCOUNT_PATH,
  GROUP_DISPLAY_NAMES,
  TESTER_EMAILS,
} from "./contants";

import { isArraySame, subArray } from "./utils";

describe("Test the groups endpoint", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: PROJECT_NUMBER,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it("Should reach list groups endpoint.", async () => {
    const response: Group[] = await firebaseAppDistribution.groups.list();
    // Just expect the endpoint to response even if there are no testers.
    expect(response.length >= 0).toBe(true);
  });

  it(`Should create a tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.create({
      displayName: GROUP_DISPLAY_NAMES[0],
      groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
    });
    expect(response.displayName).toBe(GROUP_DISPLAY_NAMES[0]);
  });

  it(`Should get the added tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response: Group | null = await firebaseAppDistribution.groups.get(
      GROUP_DISPLAY_NAMES[0] as Lowercase<string>
    );
    expect(response!.name).toBe(
      `projects/${PROJECT_NUMBER}/groups/${GROUP_DISPLAY_NAMES[0]}`
    );
  });

  it(`Should remove the tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response: number = await firebaseAppDistribution.groups.delete(
      GROUP_DISPLAY_NAMES[0] as Lowercase<string>
    );
    // Delete originally returns empty object on success, modified it to return 200 response code.
    expect(response).toBe(200);
  });
});

describe("Test behavior when groups already exists", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: PROJECT_NUMBER,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should create a tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.create({
      displayName: GROUP_DISPLAY_NAMES[0],
      groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
    });
    expect(response.displayName).toBe(GROUP_DISPLAY_NAMES[0]);
  });

  it(`Should raise an 409 error when adding existing tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    try {
      await firebaseAppDistribution.groups.create({
        displayName: GROUP_DISPLAY_NAMES[0],
        groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
      });
      fail("It should have errored out when creating an existing tester.");
    } catch (error) {
      const errObj = JSON.parse(error.message);
      expect(errObj.error.code).toBe(409);
    }
  });

  it(`Should delete the tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response: number = await firebaseAppDistribution.groups.delete(
      GROUP_DISPLAY_NAMES[0] as Lowercase<string>
    );
    // Delete originally returns empty object on success, modified it to return 200 response code.
    expect(response).toBe(200);
  });
});

describe("Test behavior when handling multiple groups.", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: PROJECT_NUMBER,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should add tester groups "${GROUP_DISPLAY_NAMES[0]}" -> "${GROUP_DISPLAY_NAMES[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      await firebaseAppDistribution.groups.create({
        displayName: GROUP_DISPLAY_NAMES[index],
      });
    }
  }, 15000);

  it(`Should get tester groups "${GROUP_DISPLAY_NAMES[0]}" -> "${GROUP_DISPLAY_NAMES[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      await firebaseAppDistribution.groups.get(
        GROUP_DISPLAY_NAMES[index] as Lowercase<string>
      );
    }
  }, 15000);

  it(`Should delete tester groups "${GROUP_DISPLAY_NAMES[0]}" -> "${GROUP_DISPLAY_NAMES[4]}".`, async () => {
    for (let index = 0; index <= 5; index++) {
      await firebaseAppDistribution.groups.delete(
        GROUP_DISPLAY_NAMES[index] as Lowercase<string>
      );
    }
  }, 15000);
});

describe("Test removing and adding of tester to groups", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: PROJECT_NUMBER,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should create the group "${GROUP_DISPLAY_NAMES[0]}}"to add the testers to.`, async () => {
    const response = await firebaseAppDistribution.groups.create({
      displayName: GROUP_DISPLAY_NAMES[0],
      groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
    });
    expect(response.displayName).toBe(GROUP_DISPLAY_NAMES[0]);
  });

  it(`Should add testers ${TESTER_EMAILS[0]} -> ${TESTER_EMAILS[4]} to group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.addTesters({
      groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
      emails: subArray(TESTER_EMAILS, 0, 5),
    });
    expect(response).toBe(200);
  });

  it(`Should remove testers ${TESTER_EMAILS[0]} -> ${TESTER_EMAILS[4]} from group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response = await firebaseAppDistribution.groups.removeTesters({
      groupId: GROUP_DISPLAY_NAMES[0] as Lowercase<string>,
      emails: subArray(TESTER_EMAILS, 0, 5),
    });
    expect(response).toBe(200);
  });

  it(`Should remove the tester group "${GROUP_DISPLAY_NAMES[0]}".`, async () => {
    const response: number = await firebaseAppDistribution.groups.delete(
      GROUP_DISPLAY_NAMES[0] as Lowercase<string>
    );
    // Delete originally returns empty object on success, modified it to return 200 response code.
    expect(response).toBe(200);
  });

  it(`Should remove testers "${TESTER_EMAILS[0]}" -> "${TESTER_EMAILS[9]}".`, async () => {
    const response: string[] = await firebaseAppDistribution.testers.remove(
      subArray(TESTER_EMAILS, 0, 5)
    );
    expect(isArraySame(response, subArray(TESTER_EMAILS, 0, 5))).toBe(true);
  });
});
