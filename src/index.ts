import {
  AuthClient,
  ExternalAccountClientOptions,
  GoogleAuth,
  GoogleAuthOptions,
  ImpersonatedOptions,
  JWTOptions,
  OAuth2ClientOptions,
  UserRefreshClientOptions,
} from "google-auth-library";
import Testers from "./testers";
import Groups from "./groups";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

interface CredentialBody {
  client_email?: string;
  private_key?: string;
  [key: string]: any;
}

interface FirebaseAppDistributionArgs<T extends AuthClient = JSONClient> {
  /**
   * Your project number.
   */
  projectNumber: string;
  /**
   * An `AuthClient` to use
   */
  authClient?: T;
  /**
   * Path to a .json, .pem, or .p12 key file
   */
  keyFilename?: string;
  /**
   * Path to a .json, .pem, or .p12 key file
   */
  keyFile?: string;
  /**
   * Object containing client_email and private_key properties, or the
   * external account client options.
   */
  credentials?: CredentialBody | ExternalAccountClientOptions;
  /**
   * Options object passed to the constructor of the client
   */
  clientOptions?:
    | JWTOptions
    | OAuth2ClientOptions
    | UserRefreshClientOptions
    | ImpersonatedOptions;
}

export default class FirebaseAppDistribution {
  projectNumber: string;
  testers: Testers;
  groups: Groups;
  private googleAuthArgs: GoogleAuthOptions;
  private accessToken: string | undefined;
  constructor({
    projectNumber,
    keyFilename,
    keyFile,
    credentials,
  }: FirebaseAppDistributionArgs) {
    this.projectNumber = projectNumber;
    this.googleAuthArgs = {
      keyFilename,
      keyFile,
      credentials,
    };
    this.testers = new Testers(this, projectNumber);
    this.groups = new Groups(this, projectNumber);
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken === undefined) {
      const auth = new GoogleAuth({
        ...this.googleAuthArgs,
        scopes: "https://www.googleapis.com/auth/cloud-platform",
      });
      this.accessToken = await auth.getAccessToken();
    }
    return this.accessToken;
  }
}