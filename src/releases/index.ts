import { readFileSync } from "node:fs";
import {
  APP_DISTRIBUTION_ENDPOINT,
  ENDPOINT_VERSION,
  makeRequest,
} from "../utils";
import { Operations, Release } from "./operations";
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

interface DeleteReleasesOptions {
  appId: string;
  releaseNames: string[];
}

interface ListReleasesOptions {
  pageSize?: number;
  orderBy?: string;
  filter?: string;
}

interface ListReleasesResponse {
  releases: Release[];
  nextPageToken: string;
}

function isValidReleaseName(releaseName: string): boolean {
  const regex = /^projects\/[^/]+\/apps\/[^/]+\/releases\/[^/]+$/;
  return regex.test(releaseName);
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

  public async delete(appId: string, releaseNames: string[]) {
    for (let releaseName of releaseNames) {
      if (!isValidReleaseName(releaseName)) {
        throw new Error(`Invalid release name: ${releaseName}`);
      }
    }

    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    if (releaseNames.length > 100) {
      throw new Error("Cannot delete more than 100 releases at once");
    }

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/apps/${appId}/releases:batchDelete`,
    );

    const response = await makeRequest(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: releaseNames,
      }),
    });

    return response;
  }

  public async distribute() {}

  public async get() {}

  public async list(
    appId: string,
    { pageSize, orderBy, filter }: ListReleasesOptions = {},
  ): Promise<ListReleasesResponse> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/apps/${appId}/releases`,
    );

    if (pageSize) {
      url.searchParams.set("pageSize", pageSize?.toString() || "100");
    }
    if (orderBy) {
      url.searchParams.set("orderBy", orderBy);
    }
    if (filter) {
      url.searchParams.set("filter", filter);
    }

    const response = await makeRequest<ListReleasesResponse>(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }

  public async update() {}
}
