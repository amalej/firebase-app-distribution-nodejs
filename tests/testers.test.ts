import FirebaseAppDistribution from "../src/index";
import { Tester } from "../src/testers";
import {
  PROJECT_NUMBER,
  SERIVCE_ACCOUNT_PATH,
  TESTER_EMAILS,
} from "./contants";
import { isArraySame, subArray } from "./utils";

// describe("Test the testers endpoint", () => {
//   const firebaseAppDistribution = new FirebaseAppDistribution({
//     projectNumber: PROJECT_NUMBER,
//     keyFile: SERIVCE_ACCOUNT_PATH,
//   });

//   it("Should reach list testers endpoint.", async () => {
//     const response: Tester[] = await firebaseAppDistribution.testers.list();
//     // Just expect the endpoint to response even if there are no testers.
//     expect(response.length >= 0).toBe(true);
//   });

//   it(`Should add a tester "${TESTER_EMAILS[0]}".`, async () => {
//     const response: Tester[] = await firebaseAppDistribution.testers.add([
//       TESTER_EMAILS[0],
//     ]);
//     expect(response[0].name).toBe(
//       `projects/${PROJECT_NUMBER}/testers/${TESTER_EMAILS[0]}`
//     );
//   });

//   it(`Should get the added tester "${TESTER_EMAILS[0]}".`, async () => {
//     const response: Tester | null = await firebaseAppDistribution.testers.get(
//       TESTER_EMAILS[0]
//     );
//     expect(response!.name).toBe(
//       `projects/${PROJECT_NUMBER}/testers/${TESTER_EMAILS[0]}`
//     );
//   });

//   it(`Should remove a tester "${TESTER_EMAILS[0]}".`, async () => {
//     const response: string[] = await firebaseAppDistribution.testers.remove([
//       TESTER_EMAILS[0],
//     ]);
//     expect(response[0]).toBe(TESTER_EMAILS[0]);
//   });

//   it(`Should get null when trying to get non-existent tester "${TESTER_EMAILS[0]}-xxx-abc-xzy".`, async () => {
//     const response: Tester | null = await firebaseAppDistribution.testers.get(
//       `${TESTER_EMAILS[0]}-xxx-abc-xzy`
//     );
//     expect(response).toBe(null);
//   });
// });

describe("Test if list endpoint is accurate", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    projectNumber: PROJECT_NUMBER,
    keyFile: SERIVCE_ACCOUNT_PATH,
  });

  it(`Should add testers "${TESTER_EMAILS[0]}" -> "${TESTER_EMAILS[9]}".`, async () => {
    const response: Tester[] = await firebaseAppDistribution.testers.add(
      subArray(TESTER_EMAILS, 0, 10)
    );
    expect(response.length).toBe(10);
  }, 10000);

  // it(`Should list testers "${TESTER_EMAILS[0]}" -> "${TESTER_EMAILS[9]}".`, async () => {
  //   const response: Tester[] = await firebaseAppDistribution.testers.list({
  //     email: "tester00*@gmail.com",
  //   });
  //   const emails = response.map((tester) =>
  //     tester.name.replace(/(.*)(\/)/gm, "")
  //   );
  //   expect(isArraySame(emails, subArray(TESTER_EMAILS, 0, 10))).toBe(true);
  // }, 10000);

  // it(`Should remove testers "${TESTER_EMAILS[0]}" -> "${TESTER_EMAILS[9]}".`, async () => {
  //   const response: string[] = await firebaseAppDistribution.testers.remove(
  //     subArray(TESTER_EMAILS, 0, 10)
  //   );
  //   expect(isArraySame(response, subArray(TESTER_EMAILS, 0, 10))).toBe(true);
  // }, 10000);
});
