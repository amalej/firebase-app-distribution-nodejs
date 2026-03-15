import { FirebaseAppDistribution } from ".";
import {
  APP_DISTRIBUTION_ENDPOINT,
  ENDPOINT_VERSION,
  makeRequest,
} from "./utils";

export interface Tester {
  name: string;
  displayName: string | undefined;
  groups: string[] | undefined;
  lastActivityTime: string | undefined;
}

interface TestersListResponse {
  testers: Tester[];
  nextPageToken: string | undefined;
}

interface TestersRemoveResponse {
  emails: string[];
}

interface TestersAddResponse {
  testers: Tester[];
}

interface TesterListArgs {
  pageSize?: number;
  email?: string;
  displayName?: string;
  groups?: string;
  maxPages?: number;
}

interface TesterUpdateArgs {
  displayName?: string;
  groups?: string[];
}

export class Testers {
  private parent: FirebaseAppDistribution;
  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
  }

  async add(emails: string[]): Promise<Tester[]> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/testers:batchAdd`,
    );
    const requestBody: string = JSON.stringify({
      emails,
    });
    const response = await makeRequest<TestersAddResponse>(url.toString(), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
      method: "POST",
    });
    return response.testers || [];
  }

  async remove(emails: string[]): Promise<string[]> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/testers:batchRemove`,
    );
    const requestBody: string = JSON.stringify({
      emails,
    });
    const response = await makeRequest<TestersRemoveResponse>(url.toString(), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
      method: "POST",
    });
    return response.emails || [];
  }

  async list({
    pageSize = 50,
    email,
    displayName,
    groups,
    maxPages = 10,
  }: TesterListArgs = {}): Promise<Tester[]> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const testerList = [];

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/testers`,
    );
    url.searchParams.set("pageSize", pageSize.toString());

    let filterParts = [];
    if (email) filterParts.push(`name="projects/-/testers/${email}"`);
    if (displayName) filterParts.push(`displayName="${displayName}"`);
    if (groups) filterParts.push(`groups="projects/*/groups/${groups}"`);

    if (filterParts.length > 0) {
      url.searchParams.set("filter", filterParts.join(" "));
    }

    let nextPageToken = "";
    for (let page = 0; page < maxPages; page++) {
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      } else {
        url.searchParams.delete("pageToken");
      }
      const response = await makeRequest<TestersListResponse>(url.toString(), {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        body: null,
        method: "GET",
      });

      if (response.testers === undefined) {
        break;
      }

      testerList.push(...response.testers);
      if (response.nextPageToken !== undefined) {
        nextPageToken = response.nextPageToken;
      } else {
        break;
      }
    }
    return testerList;
  }

  async get(email: string): Promise<Tester | null> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/testers`,
    );
    url.searchParams.append("pageSize", "1");
    url.searchParams.append("filter", `name="projects/-/testers/${email}"`);
    const response = await makeRequest<TestersListResponse>(url.toString(), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: null,
      method: "GET",
    });

    return response.testers !== undefined ? response.testers[0] : null;
  }

  async update(
    email: string,
    { displayName, groups }: TesterUpdateArgs,
  ): Promise<Tester> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/testers/${email}`,
    );

    let updateMaskParts = [];
    if (displayName !== undefined) {
      updateMaskParts.push("displayName");
    }
    if (groups !== undefined) {
      updateMaskParts.push("groups");
    }
    if (updateMaskParts.length > 0) {
      url.searchParams.append("updateMask", updateMaskParts.join(","));
    }

    const formattedGroups = groups?.map(
      (group) => `projects/${projectNumber}/groups/${group}`,
    );

    const response = await makeRequest<Tester>(url.toString(), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        displayName: displayName || undefined,
        groups: formattedGroups || undefined,
      }),
      method: "PATCH",
    });

    return response;
  }
}
