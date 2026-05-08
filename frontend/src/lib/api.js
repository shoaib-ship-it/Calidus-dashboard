const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

function buildUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.detail || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const supplierApi = {
  list: () => request("/api/suppliers"),
  get: (id) => request(`/api/suppliers/${id}`),
  create: (payload) => request("/api/suppliers", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/suppliers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateStatus: (id, status) => request(`/api/suppliers/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (id) => request(`/api/suppliers/${id}`, { method: "DELETE" }),
};

export const productApi = {
  list: () => request("/api/products"),
  get: (id) => request(`/api/products/${id}`),
  create: (payload) => request("/api/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateStatus: (id, status) => request(`/api/products/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
};

export { API_BASE_URL };
