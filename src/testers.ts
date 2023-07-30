import FirebaseAppDistribution from ".";
import { constructUrl, makeRequest } from "./utils";

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

export default class Testers {
  private projectNumber: string;
  private parent: FirebaseAppDistribution;
  constructor(parent: FirebaseAppDistribution, projectNumber: string) {
    this.parent = parent;
    this.projectNumber = projectNumber;
  }

  async add(emails: string[]): Promise<Tester[]> {
    const accessToken = await this.parent.getAccessToken();
    const url = constructUrl(this.projectNumber, "testers:batchAdd");
    const requestBody: string = JSON.stringify({
      emails,
    });
    const response: TestersAddResponse = await makeRequest(url, {
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
    const url = constructUrl(this.projectNumber, "testers:batchRemove");
    const requestBody: string = JSON.stringify({
      emails,
    });
    const response: TestersRemoveResponse = await makeRequest(url, {
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
    email = "",
    displayName = "",
    groups = "",
    maxPages = 10,
  }: TesterListArgs = {}): Promise<Tester[]> {
    const accessToken = await this.parent.getAccessToken();
    let testerList = [];
    let filter = "";
    let query = `?pageSize=${pageSize}`;
    let nextPageToken = "";
    filter += email !== "" ? `name="projects/-/testers/${email}"` : "";
    filter += displayName !== "" ? `displayName="${displayName}"` : "";
    filter += groups !== "" ? `groups="projects/*/groups/${groups}"` : "";
    filter = filter !== "" ? `&filter=${encodeURIComponent(filter)}` : "";
    for (let page = 0; page < maxPages; page++) {
      nextPageToken =
        nextPageToken !== ""
          ? `&pageToken=${encodeURIComponent(nextPageToken)}`
          : "";
      const url = `${constructUrl(
        this.projectNumber,
        "testers"
      )}${query}${nextPageToken}${filter}`;
      const response: TestersListResponse = await makeRequest(url, {
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
    let query = `?pageSize=1`;
    const filter = `&filter=${encodeURIComponent(
      `name="projects/-/testers/${email}"`
    )}`;
    const url = `${constructUrl(
      this.projectNumber,
      "testers"
    )}${query}${filter}`;
    const response: TestersListResponse = await makeRequest(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: null,
      method: "GET",
    });
    return response.testers !== undefined ? response.testers[0] : null;
  }

  // TODO: The patch API is not properly documented. Implement in the future.
  // See: https://firebase.google.com/docs/reference/app-distribution/rest/v1/projects.testers/patch
  // async update(email: string, displayName: string = "", groups: string[]) {
  //   const accessToken = await this.getAccessToken();
  //   const url = `${this.constructUrl("testers")}/${email}`;
  //   const response = await fetch(url, {
  //     headers: {
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //     body: null,
  //     method: "PATCH",
  //   });
  // }
}
