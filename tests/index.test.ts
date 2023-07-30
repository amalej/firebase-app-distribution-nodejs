import { FirebaseAppDistribution } from "../src";
import { PROJECT_NUMBER } from "./contants";

describe("Test authentication success.", () => {
  it("Should authenticate properly using service account file path.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      projectNumber: PROJECT_NUMBER,
      keyFile: "./service-account.json",
    });
    const accessToken = await firebaseAppDistribution.getAccessToken();
    expect(/ya29.*/gim.test(accessToken)).toBe(true);
  });
});

describe("Test authentication error.", () => {
  it("Should not authenticate properly using service account credentials.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      projectNumber: PROJECT_NUMBER,
      credentials: {
        client_email: "invalid_email",
        private_key: "invalid_key",
      },
    });
    await expect(
      async () => await firebaseAppDistribution.getAccessToken()
    ).rejects.toThrow("error:1E08010C:DECODER routines::unsupported");
  });

  it("Should not authenticate properly using service account file path.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      projectNumber: PROJECT_NUMBER,
    });
    await expect(
      async () => await firebaseAppDistribution.getAccessToken()
    ).rejects.toThrow(
      "Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information."
    );
  });
});
