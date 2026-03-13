import { GoogleAuth } from "google-auth-library";
import { FirebaseAppDistribution } from "../src";
import { PROJECT_NUMBER } from "./contants";

describe("Test authentication success.", () => {
  it("Should authenticate properly using service account file path.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      keyFile: "./service-account.json",
    });
    const accessToken = await firebaseAppDistribution.getAccessToken();
    expect(/ya29.*/gim.test(accessToken)).toBe(true);
  });
});

describe("Authentication error.", () => {
  it("Should be raised when trying to authenticate using invalid service account credentials.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      credentials: {
        client_email: "invalid_email",
        private_key: "invalid_key",
      },
    });
    await expect(
      async () => await firebaseAppDistribution.getAccessToken(),
    ).rejects.toThrow("error:1E08010C:DECODER routines::unsupported");
  });
});

describe("Test getProjectNumber and getProjectId.", () => {
  const firebaseAppDistribution = new FirebaseAppDistribution({
    keyFile: "./service-account.json",
  });

  it("Should get project number and project id successfully.", async () => {
    const projectNumber = await firebaseAppDistribution.getProjectNumber();
    const projectId = await firebaseAppDistribution.getProjectId();
    expect(projectNumber).toBe(PROJECT_NUMBER);
    expect(projectId).toBeTruthy();
  });
});

describe("Test caching.", () => {
  it("Should use cached values for projectId, projectNumber and accessToken.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      keyFile: "./service-account.json",
    });

    await firebaseAppDistribution.getProjectId();
    await firebaseAppDistribution.getProjectNumber();
    await firebaseAppDistribution.getAccessToken();

    const projectId = await firebaseAppDistribution.getProjectId();
    const projectNumber = await firebaseAppDistribution.getProjectNumber();
    const accessToken = await firebaseAppDistribution.getAccessToken();

    expect(projectId).toBeTruthy();
    expect(projectNumber).toBe(PROJECT_NUMBER);
    expect(accessToken).toBeTruthy();
  });
});

describe("Internal Error cases.", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Should throw error if project number is not found.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      keyFile: "./service-account.json",
    });

    const mockRequest = jest.fn().mockResolvedValue({ data: {} });
    (jest.spyOn(GoogleAuth.prototype, "getProjectId") as any).mockResolvedValue(
      "test-project",
    );
    jest.spyOn(GoogleAuth.prototype, "getClient").mockResolvedValue({
      request: mockRequest,
    } as any);

    await expect(firebaseAppDistribution.getProjectNumber()).rejects.toThrow(
      "Failed to retrieve project number",
    );
  });

  it("Should throw error if access token is not found.", async () => {
    const firebaseAppDistribution = new FirebaseAppDistribution({
      keyFile: "./service-account.json",
    });

    jest.spyOn(GoogleAuth.prototype, "getAccessToken").mockResolvedValue(null);

    await expect(firebaseAppDistribution.getAccessToken()).rejects.toThrow(
      "Failed to retrieve access token",
    );
  });
});
