// ─── API SERVICE ──────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000/api/v1";

const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  async login(identifier, password) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
  },

  async signup(userData) {
    return this.request("/auth/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async getDomains() {
    return this.request("/domains/");
  },

  async getOrganizations() {
    return this.request("/organizations/");
  },

  async getDepartments() {
    return this.request("/departments/");
  },

  async getWings() {
    return this.request("/wings/");
  },

  async getMembers() {
    return this.request("/memberships/");
  },
};

export default api;
