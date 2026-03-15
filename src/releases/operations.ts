import { FirebaseAppDistribution } from "../";
import {
  APP_DISTRIBUTION_ENDPOINT,
  ENDPOINT_VERSION,
  makeRequest,
} from "../utils";

type UploadReleaseResult =
  | "UPLOAD_RELEASE_RESULT_UNSPECIFIED"
  | "RELEASE_CREATED"
  | "RELEASE_UPDATED"
  | "RELEASE_UNMODIFIED";

interface Release {
  name: string;
  releaseNotes?: string;
  displayVersion: string;
  buildVersion: string;
  createTime: Date;
  firebaseConsoleUri: string;
  testingUri: string;
  binaryDownloadUri: string;
}

interface OperationsGetResponse {
  name: string;
  done: boolean;
  error?: {
    code: number;
    message: string;
    status: string;
  };
  response?: {
    "@type": string;
    result: UploadReleaseResult;
    release: Release;
  };
  metadata?: any;
}

export class Operations {
  private parent: FirebaseAppDistribution;

  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
  }

  async get(operationName: string): Promise<OperationsGetResponse> {
    const accessToken = await this.parent.getAccessToken();
    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/${operationName}`,
    );

    const response = await makeRequest<OperationsGetResponse>(url.toString(), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }
}
