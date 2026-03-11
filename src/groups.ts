import { FirebaseAppDistribution } from ".";
import {
  APP_DISTRIBUTION_ENDPOINT,
  constructUrl,
  ENDPOINT_VERSION,
  makeRequest,
} from "./utils";

export interface Group {
  name: string;
  displayName: string;
  testerCount: number;
  releaseCount: number;
  inviteLinkCount: number;
}

interface GroupListResponse {
  groups: Group[];
  nextPageToken: string;
}

type validGroupId = Lowercase<string>;

interface GroupListArgs {
  pageSize?: number;
  maxPages?: number;
}

interface GroupCreateArgs {
  displayName: string;
  groupId?: validGroupId;
}

interface GroupRemoveTestersArgs {
  groupId: validGroupId;
  emails: string[];
}

interface GroupAddTestersArgs {
  groupId: validGroupId;
  emails: string[];
}

export default class Groups {
  private parent: FirebaseAppDistribution;
  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
  }

  async create({ displayName, groupId = "" }: GroupCreateArgs): Promise<Group> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const query = groupId !== "" ? `?groupId=${groupId}` : "";
    const url = `${constructUrl(projectNumber, "groups")}${query}`;
    const requestBody = JSON.stringify({
      displayName,
    });
    const response: Group = await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
      method: "POST",
    });
    return response;
  }

  async delete(groupId: validGroupId): Promise<{}> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups/${groupId}`,
    );
    // This response body is an empty object if successfull.
    // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.groups/delete#response-body
    await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: null,
      method: "DELETE",
    });
    return {};
  }

  async get(groupId: validGroupId): Promise<Group | null> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = `${constructUrl(projectNumber, `groups/${groupId}`)}`;
    try {
      const response: Group = await makeRequest(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        body: null,
        method: "GET",
      });
      return response;
    } catch (_) {
      return null;
    }
  }

  async list({ pageSize = 25, maxPages = 10 }: GroupListArgs = {}): Promise<
    Group[]
  > {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    let groupList = [];
    let query = `?pageSize=${pageSize}`;
    let nextPageToken = "";
    for (let page = 0; page < maxPages; page++) {
      nextPageToken =
        nextPageToken !== ""
          ? `&pageToken=${encodeURIComponent(nextPageToken)}`
          : "";
      const url = `${constructUrl(
        projectNumber,
        "groups",
      )}${query}${nextPageToken}`;
      const response: GroupListResponse = await makeRequest(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        body: null,
        method: "GET",
      });

      if (response.groups === undefined) {
        break;
      }

      groupList.push(...response.groups);
      if (response.nextPageToken !== undefined) {
        nextPageToken = response.nextPageToken;
      } else {
        break;
      }
    }
    return groupList;
  }

  async removeTesters({
    groupId,
    emails,
  }: GroupRemoveTestersArgs): Promise<number> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = constructUrl(
      projectNumber,
      `groups/${groupId}:batchLeave`,
    );
    const reuqestBody = JSON.stringify({
      emails,
    });
    // This response body is an empty object if successfull.
    // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.groups/batchLeave#response-body
    await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: reuqestBody,
      method: "POST",
    });
    return 200;
  }

  async addTesters({ groupId, emails }: GroupAddTestersArgs): Promise<number> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = constructUrl(projectNumber, `groups/${groupId}:batchJoin`);
    const reuqestBody = JSON.stringify({
      emails,
      createMissingTesters: true,
    });
    // This response body is an empty object if successfull.
    // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.groups/batchJoin#response-body
    await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: reuqestBody,
      method: "POST",
    });
    return 200;
  }
}
