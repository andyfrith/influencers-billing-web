/**
 * Security configuration utilities.
 */
export function isAdminBootstrapEnabled(): boolean {
  return process.env.ENABLE_ADMIN_BOOTSTRAP === "true" && process.env.NODE_ENV !== "production";
}

/**
 * Restricts sensitive bootstrap actions to local requests.
 */
export function isLocalRequest(request: Request): boolean {
  const allowedHosts = new Set(["localhost", "127.0.0.1", "::1"]);

  const hostHeader = request.headers.get("host");
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  const host = hostHeader ? hostHeader.split(":")[0]?.toLowerCase() : null;
  const originHost = parseHost(originHeader);
  const refererHost = parseHost(refererHeader);

  const hostIsLocal = host ? allowedHosts.has(host) : false;
  const originIsLocal = originHost ? allowedHosts.has(originHost) : false;
  const refererIsLocal = refererHost ? allowedHosts.has(refererHost) : false;

  return hostIsLocal && (originHeader ? originIsLocal : true) && (refererHeader ? refererIsLocal : true);
}

function parseHost(urlValue: string | null): string | null {
  if (!urlValue) {
    return null;
  }

  try {
    return new URL(urlValue).hostname.toLowerCase();
  } catch {
    return null;
  }
}
