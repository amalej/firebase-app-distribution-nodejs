import { GoogleAuth, GoogleAuthOptions } from "google-auth-library";
import { AUTH_SCOPES } from "./utils";
import { Testers } from "./testers";
import { Groups } from "./groups";
import { Releases } from "./releases";

interface UploadAndDistributeOptions {
  appId: string;
  binaryPath: string;
  fileName: string;
  testerEmails: string[];
  groupAliases: string[];
  releaseNotes?: string;
  uploadOperationTimeout?: number;
  uploadOperationInteval?: number;
}

export interface FirebaseAppDistributionAuthOptions extends Omit<
  GoogleAuthOptions,
  "scopes"
> {}

export class FirebaseAppDistribution {
  private projectNumber: string | null = null;
  private projectId: string | null = null;
  private googleAuth: GoogleAuth;
  private accessToken: string | undefined;

  testers: Testers;
  groups: Groups;
  releases: Releases;

  constructor(authOptions: FirebaseAppDistributionAuthOptions) {
    this.googleAuth = new GoogleAuth({
      ...authOptions,
      scopes: AUTH_SCOPES,
    });
    this.testers = new Testers(this);
    this.groups = new Groups(this);
    this.releases = new Releases(this);
  }

  async getProjectId(): Promise<string> {
    if (this.projectId) {
      return this.projectId;
    }

    // For some reason, the project ID is not available until after we get an access token.
    // This is a workaround to ensure we have the project ID when needed.
    await this.getAccessToken();
    this.projectId = await this.googleAuth.getProjectId();
    return this.projectId;
  }

  async getProjectNumber(): Promise<string> {
    if (this.projectNumber) {
      return this.projectNumber;
    }

    const projectId = await this.getProjectId();
    const client = await this.googleAuth.getClient();

    const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
    const res: any = await client.request({ url });

    this.projectNumber = res.data.projectNumber;
    if (!this.projectNumber) {
      throw new Error("Failed to retrieve project number");
    }
    return this.projectNumber;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const accessToken = await this.googleAuth.getAccessToken();
    if (!accessToken) {
      throw new Error("Failed to retrieve access token");
    }
    this.accessToken = accessToken;
    return this.accessToken;
  }

  async uploadAndDistribute({
    appId,
    binaryPath,
    fileName,
    testerEmails = [],
    groupAliases = [],
    releaseNotes,
    uploadOperationInteval = 500,
    uploadOperationTimeout = 5_000,
  }: UploadAndDistributeOptions) {
    const operation = await this.releases.upload(appId, binaryPath, fileName);
    const operationName = operation.name;

    const uploadTimeout = setTimeout(() => {
      throw new Error("Upload operation timed out");
    }, uploadOperationTimeout);

    let doneUploading = false;
    let releaseName: string | null = null;
    while (!doneUploading) {
      const operationData = await this.releases.operations.get(operationName);
      if (operationData.done) {
        doneUploading = true;
        releaseName = operationData.response!.release.name;
        clearTimeout(uploadTimeout);
      }

      if (operationData.error) {
        throw new Error(
          `Upload operation failed with code ${operationData.error.code} and error: ${operationData.error.message}`,
        );
      }
      await new Promise((res) => setTimeout(res, uploadOperationInteval));
    }

    if (testerEmails.length !== 0 || groupAliases.length !== 0) {
      await this.releases.distribute(releaseName!, {
        testerEmails,
        groupAliases,
      });
    }

    if (releaseNotes) {
      await this.releases.addReleaseNotes(releaseName!, releaseNotes);
    }

    const finalReleaseData = await this.releases.get(releaseName!);
    return finalReleaseData;
  }
}
