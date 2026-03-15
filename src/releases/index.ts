import { readFileSync } from "node:fs";
import {
  APP_DISTRIBUTION_ENDPOINT,
  ENDPOINT_VERSION,
  makeRequest,
} from "../utils";
import { Operations } from "./operations";
import { FirebaseAppDistribution } from "../";

interface UploadReleaseOptions {
  appId: string;
  binaryPath: string;
  fileName: string;
}

// https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.apps.releases.operations#resource:-operation
interface UploadReleaseResponse {
  name: string; // name of the operation.
}

export class Releases {
  private parent: FirebaseAppDistribution;

  operations: Operations;

  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
    this.operations = new Operations(this.parent);
  }

  public async upload({ appId, binaryPath, fileName }: UploadReleaseOptions) {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/upload/${ENDPOINT_VERSION}/projects/${projectNumber}/apps/${appId}/releases:upload`,
    );
    const fileBuffer = readFileSync(binaryPath);

    const response = await makeRequest<UploadReleaseResponse>(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Goog-Upload-File-Name": encodeURIComponent(fileName),
        "X-Goog-Upload-Protocol": "raw",
      },
      body: new Uint8Array(fileBuffer),
    });

    return response;
  }
}
