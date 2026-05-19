const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

function buildAbsoluteUrl(path) {
  if (!path.startsWith("/")) {
    throw new Error(`Expected an absolute path starting with '/': ${path}`);
  }

  return `${API_BASE_URL}${path}`;
}

function buildWebSocketUrl(path) {
  const apiUrl = new URL(API_BASE_URL);
  const protocol = apiUrl.protocol === "https:" ? "https:" : "http:";

  return `${protocol}//${apiUrl.host}${path}`;
}

export { API_BASE_URL, buildAbsoluteUrl, buildWebSocketUrl };
