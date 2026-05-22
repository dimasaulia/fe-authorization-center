import { envConfig } from "@/config/env.config";

type RequestOptions = RequestInit & {
  baseUrl?: string;
  language?: string;
};

export async function apiClient<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { baseUrl = envConfig.apiGatewayUrl, language, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers);

  if (language) {
    headers.set("Accept-Language", language);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
