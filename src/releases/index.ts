import { readFileSync } from "node:fs";
import {
  APP_DISTRIBUTION_ENDPOINT,
  ENDPOINT_VERSION,
  makeRequest,
} from "../utils";
import { Operation, Operations, Release } from "./operations";
import { FirebaseAppDistribution } from "../";

interface ListReleasesOptions {
  pageSize?: number;
  orderBy?: string;
  filter?: string;
  maxPages?: number;
}

interface ListReleasesResponse {
  releases: Release[];
  nextPageToken: string;
}

interface DistributeReleaseOptions {
  testerEmails: string[];
  groupAliases: string[];
}

interface UpdateReleaseOptions {
  releaseNotes?: string;
}

function isValidReleaseName(releaseName: string): boolean {
  const regex = /^projects\/[^/]+\/apps\/[^/]+\/releases\/[^/]+$/;
  return regex.test(releaseName);
}

function validateReleaseName(releaseName: string) {
  if (!isValidReleaseName(releaseName)) {
    throw new Error(
      `Invalid release name: ${releaseName}. Expected 'projects/*/apps/*/releases/*'`,
    );
  }
  return;
}

export class Releases {
  private parent: FirebaseAppDistribution;

  operations: Operations;

  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
    this.operations = new Operations(this.parent);
  }

  public async upload(
    appId: string,
    binaryPath: string,
    fileName: string,
  ): Promise<Operation> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/upload/${ENDPOINT_VERSION}/projects/${projectNumber}/apps/${appId}/releases:upload`,
    );
    const fileBuffer = readFileSync(binaryPath);

    const response = await makeRequest<Operation>(url.toString(), {
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

  public async delete(appId: string, releaseNames: string[]): Promise<{}> {
    for (let releaseName of releaseNames) {
      validateReleaseName(releaseName);
    }

    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    if (releaseNames.length > 100) {
      throw new Error("Cannot delete more than 100 releases at once");
    }

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/apps/${appId}/releases:batchDelete`,
    );

    const response = await makeRequest<{}>(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        names: releaseNames,
      }),
    });

    return response;
  }

  public async distribute(
    releaseName: string,
    { testerEmails = [], groupAliases = [] }: DistributeReleaseOptions,
  ) {
    validateReleaseName(releaseName);
    if (testerEmails.length === 0 && groupAliases.length === 0) {
      throw new Error("Must specify at least one tester or group");
    }
    const accessToken = await this.parent.getAccessToken();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/${releaseName}:distribute`,
    );

    const response = await makeRequest<Release>(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        testerEmails,
        groupAliases,
      }),
    });

    return response;
  }

  public async get(releaseName: string) {
    validateReleaseName(releaseName);
    const accessToken = await this.parent.getAccessToken();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/${releaseName}`,
    );

    const response = await makeRequest<Release>(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }

  public async list(
    appId: string,
    { pageSize, orderBy, filter, maxPages }: ListReleasesOptions = {},
  ): Promise<Release[]> {
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

    let nextPageToken = "";
    let currentPage = 0;
    const releases: Release[] = [];
    do {
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      } else {
        url.searchParams.delete("pageToken");
      }

      const response = await makeRequest<ListReleasesResponse>(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.releases === undefined) {
        break;
      }

      releases.push(...response.releases);
      if (response.nextPageToken !== undefined) {
        nextPageToken = response.nextPageToken;
      } else {
        break;
      }

      currentPage++;
      if (maxPages && currentPage >= maxPages) {
        break;
      }
    } while (nextPageToken);

    return releases;
  }

  async #update(
    releaseName: string,
    { releaseNotes }: UpdateReleaseOptions = {},
  ) {
    validateReleaseName(releaseName);
    const accessToken = await this.parent.getAccessToken();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/${releaseName}`,
    );

    if (releaseNotes) {
      url.searchParams.set("updateMask", "releaseNotes.text");
    }

    const response = await makeRequest<Release>(url.toString(), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        releaseNotes: {
          text: releaseNotes,
        },
      }),
    });

    return response;
  }

  public async addReleaseNotes(releaseName: string, releaseNotes: string) {
    return this.#update(releaseName, { releaseNotes });
  }
}
