export type AsyncFunction<T> = () => Promise<T>;

export const BASE_URL: string =
  "https://firebaseappdistribution.googleapis.com/v1/projects";

export async function makeRequest(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<any> {
  const response = await fetch(input, init);
  if (response.status !== 200) {
    const errMessage = await response.text();
    throw Error(errMessage);
  }
  const responseText = await response.text();
  const responseObj = JSON.parse(responseText);
  return responseObj;
}

export function constructUrl(projectNumber: string, endpoint: string): string {
  return `${BASE_URL}/${projectNumber}/${endpoint}`;
}
