import { GoogleAuth, GoogleAuthOptions } from "google-auth-library";
import Testers from "./testers";
import Groups from "./groups";

export interface FirebaseAppDistributionAuthOptions extends Omit<
  GoogleAuthOptions,
  "scopes"
> {}

const AUTH_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/firebase",
];

export class FirebaseAppDistribution {
  private projectNumber: string | null = null;
  private projectId: string | null = null;
  private googleAuth: GoogleAuth;
  private accessToken: string | undefined;

  testers: Testers;
  groups: Groups;

  constructor(authOptions: FirebaseAppDistributionAuthOptions) {
    this.googleAuth = new GoogleAuth({
      ...authOptions,
      scopes: AUTH_SCOPES,
    });
    this.testers = new Testers(this);
    this.groups = new Groups(this);
  }

  async getProjectId(): Promise<string> {
    if (this.projectId) {
      return this.projectId;
    }

    this.projectId = await this.googleAuth.getProjectId();
    return this.projectId;
  }

  async getProjectNumber(): Promise<string> {
    if (this.projectNumber) {
      return this.projectNumber;
    }
    const projectId = await this.googleAuth.getProjectId();
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
