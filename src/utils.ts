export const APP_DISTRIBUTION_ENDPOINT: string =
  "https://firebaseappdistribution.googleapis.com";
export const ENDPOINT_VERSION: string = "v1";
export const AUTH_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/firebase",
];

export async function makeRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  if (response.status !== 200) {
    const errMessage = await response.text();
    throw Error(
      `Request failed with status code ${response.status} and message: ${errMessage}`,
    );
  }

  const responseText = await response.text();
  const responseObj = JSON.parse(responseText);
  return responseObj;
}
