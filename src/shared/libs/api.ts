const DEFAULT_API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3000';

export const apiBaseUrl = DEFAULT_API_URL;

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();
  if (!response.ok) {
    const message = isJson && (payload as any)?.message ? (payload as any).message : response.statusText;
    const error = new Error(message || 'Request failed');
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }
  return payload;
}

export async function getJson(path: string) {
  const res = await fetch(`${apiBaseUrl}${path}`);
  return handleResponse(res);
}

export async function postJson(path: string, body?: any) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

export async function putJson(path: string, body?: any) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

export async function patchJson(path: string, body?: any) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(res);
}

export async function del(path: string) {
  const res = await fetch(`${apiBaseUrl}${path}`, { method: 'DELETE' });
  return handleResponse(res);
}

