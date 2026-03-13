import { FirebaseAppDistribution } from ".";
import {
  APP_DISTRIBUTION_ENDPOINT,
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

interface GroupUpdateArgs {
  displayName?: string;
}

export default class Groups {
  private parent: FirebaseAppDistribution;
  constructor(parent: FirebaseAppDistribution) {
    this.parent = parent;
  }

  async create({ displayName, groupId = "" }: GroupCreateArgs): Promise<Group> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups`,
    );
    url.searchParams.set("groupId", groupId);

    const requestBody = JSON.stringify({
      displayName,
    });

    const response = await makeRequest<Group>(url, {
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
    const response = await makeRequest<{}>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: null,
      method: "DELETE",
    });
    return response;
  }

  async get(groupId: validGroupId): Promise<Group | null> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups/${groupId}`,
    );
    const response = await makeRequest<Group>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: null,
      method: "GET",
    });
    return response;
  }

  async list({ pageSize = 25, maxPages = 10 }: GroupListArgs = {}): Promise<
    Group[]
  > {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const groupList: Group[] = [];

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups`,
    );
    url.searchParams.set("pageSize", pageSize.toString());

    let nextPageToken = "";
    for (let page = 0; page < maxPages; page++) {
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      } else {
        url.searchParams.delete("pageToken");
      }
      const response = await makeRequest<GroupListResponse>(url, {
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

  async update(
    groupId: validGroupId,
    { displayName }: GroupUpdateArgs,
  ): Promise<Group> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups/${groupId}`,
    );

    if (displayName) {
      url.searchParams.set("updateMask", "displayName");
    }

    const requestBody = JSON.stringify({
      displayName,
    });

    const response = await makeRequest<Group>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
      method: "PATCH",
    });
    return response;
  }

  async removeTesters({
    groupId,
    emails,
  }: GroupRemoveTestersArgs): Promise<{}> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups/${groupId}:batchLeave`,
    );
    const reuqestBody = JSON.stringify({
      emails,
    });
    // This response body is an empty object if successfull.
    // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.groups/batchLeave#response-body
    const response = await makeRequest<{}>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: reuqestBody,
      method: "POST",
    });
    return response;
  }

  async addTesters({ groupId, emails }: GroupAddTestersArgs): Promise<{}> {
    const accessToken = await this.parent.getAccessToken();
    const projectNumber = await this.parent.getProjectNumber();

    const url = new URL(
      `${APP_DISTRIBUTION_ENDPOINT}/${ENDPOINT_VERSION}/projects/${projectNumber}/groups/${groupId}:batchJoin`,
    );
    const reuqestBody = JSON.stringify({
      emails,
      createMissingTesters: true,
    });
    // This response body is an empty object if successfull.
    // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.groups/batchJoin#response-body
    const response = await makeRequest<{}>(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: reuqestBody,
      method: "POST",
    });
    return response;
  }
}
