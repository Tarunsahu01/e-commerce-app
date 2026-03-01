/**
 * Parse JWT payload without verification (client-side display only).
 * Token verification happens server-side. We decode for UI (email in navbar).
 */
export function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
