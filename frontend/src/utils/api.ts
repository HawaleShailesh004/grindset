/** API helpers: base URL and settings endpoints. */

const envBase = import.meta.env.VITE_API_URL ?? "";

export function getApiBase(): string {
  return envBase.replace(/\/api\/?$/, "");
}

export function getSettingsUrl(): string {
  return `${getApiBase()}/api/settings`;
}

export function getChatUrl(): string {
  return `${getApiBase()}/api/chat`;
}

export function getAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchSettings(token: string): Promise<Response> {
  return fetch(getSettingsUrl(), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function patchSettings(
  token: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(getSettingsUrl(), {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  });
}
