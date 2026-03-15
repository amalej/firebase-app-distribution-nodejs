import { GoogleAuth, GoogleAuthOptions } from "google-auth-library";
import { AUTH_SCOPES } from "./utils";
import { Testers } from "./testers";
import { Groups } from "./groups";
import { Releases } from "./releases";

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
}
