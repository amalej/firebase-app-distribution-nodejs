import { PROJECT_NUMBER, SERIVCE_ACCOUNT_PATH } from "./contants";
import { makeRequest } from "../src/utils";
import { FirebaseAppDistribution } from "../src/index";

describe("Test the utils files", () => {
  it("Should properly construct a base url", () => {
    const url = new URL(
      `https://firebaseappdistribution.googleapis.com/v1/projects/${PROJECT_NUMBER}/testers`,
    );
    expect(url.toString()).toBe(
      `https://firebaseappdistribution.googleapis.com/v1/projects/${PROJECT_NUMBER}/testers`,
    );
  });

  it("Should properly reach the endpoint", async () => {
    const url = new URL(
      `https://firebaseappdistribution.googleapis.com/v1/projects/${PROJECT_NUMBER}/testers?pageSize=1`,
    );
    const firebaseAppDistribution = new FirebaseAppDistribution({
      keyFile: SERIVCE_ACCOUNT_PATH,
    });
    const accessToken = await firebaseAppDistribution.getAccessToken();

    await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });
  });

  it("It should error out when not receiving a JSON response.", async () => {
    try {
      await makeRequest("https://google.com");
      fail("It should throw an error when response is not JSON.");
    } catch (error: any) {
      expect(error.message).toBe(
        `Unexpected token '<', "<!doctype "... is not valid JSON`,
      );
    }
  });
});
