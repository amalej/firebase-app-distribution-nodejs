import { GoogleAuth, GoogleAuthOptions } from "google-auth-library";
import Testers from "./testers";

export interface FirebaseAppDistributionAuthOptions extends Omit<
  GoogleAuthOptions,
  "scopes" | "projectId"
> {}

const AUTH_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/firebase",
];

export class FirebaseAppDistribution {
  projectNumber: string;
  projectId: string;
  testers: Testers;
  // groups: Groups;
  private googleAuth: GoogleAuth;
  private accessToken: string | undefined;
  constructor(authOptions: FirebaseAppDistributionAuthOptions) {
    this.googleAuth = new GoogleAuth({
      ...authOptions,
      scopes: AUTH_SCOPES,
    });
    this.testers = new Testers(this);
    // this.groups = new Groups(this);
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
    return this.projectNumber;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    this.accessToken = await this.googleAuth.getAccessToken();
    return this.accessToken;
  }
}
