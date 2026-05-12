const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const AUTH_STORAGE_KEY = "healthbridge.auth";

async function request(path, options = {}) {
  // Extract headers separately so they don't overwrite our defaults
  const { headers, ...restOptions } = options;
  const isFormData = typeof FormData !== "undefined" && restOptions.body instanceof FormData;

  const resolvedHeaders = {
    ...(headers || {}),
  };

  if (!isFormData && !resolvedHeaders["Content-Type"]) {
    resolvedHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions, // Put method, body, etc. first
    headers: resolvedHeaders,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(extractErrorMessage(data));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function extractErrorMessage(data) {
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data === "object") {
    const firstMessage = Object.values(data).find((value) => typeof value === "string");
    if (firstMessage) return firstMessage;
  }
  return "Something went wrong. Please try again.";
}

export function getFieldErrors(error) {
  if (!error?.data || typeof error.data !== "object" || error.data.message) return {};
  return Object.fromEntries(
    Object.entries(error.data).filter(([, value]) => typeof value === "string")
  );
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refresh(refreshToken) {
  return request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function signupPatient(payload) {
  return request("/auth/signup/user", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signupAdmin(payload) {
  return request("/auth/signup/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signupDriver(payload) {
  return request("/auth/signup/driver", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signupDoctor(payload) {
  return request("/auth/signup/doctor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function saveAuthSession(session, remember) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  otherStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession() {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  return rawSession ? JSON.parse(rawSession) : null;
}

export async function refreshAuthSession() {
  const session = getAuthSession();
  if (!session?.refreshToken) return null;

  const refreshed = await refresh(session.refreshToken);
  const nextSession = { ...session, ...refreshed };
  saveAuthSession(nextSession, Boolean(localStorage.getItem(AUTH_STORAGE_KEY)));
  return nextSession;
}

export async function authenticatedFetch(path, options = {}) {
  const session = getAuthSession();
  const tokenType = session?.tokenType || "Bearer";

  const send = (accessToken) =>
    request(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `${tokenType} ${accessToken}` } : {}),
      },
    });

  try {
    return await send(session?.accessToken);
  } catch (error) {
    if (error.status !== 401 || !session?.refreshToken) throw error;
    const refreshed = await refreshAuthSession();
    return send(refreshed?.accessToken);
  }
}

export function getMedicalReports() {
  return authenticatedFetch("/api/reports/my");
}

export function askMedicalReports(query) {
  return authenticatedFetch("/api/reports/ask", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export function uploadMedicalReport(file) {
  const formData = new FormData();
  formData.append("file", file);

  return authenticatedFetch("/api/reports/upload", {
    method: "POST",
    body: formData,
  });
}
