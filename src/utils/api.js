const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Separate base URLs for different API groups
const AUTH_API_URL = `${API_BASE_URL}/auth`;
const ORGANIZATION_API_URL = API_BASE_URL;

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

export const api = {
    async request(endpoint, options = {}, baseUrl = API_BASE_URL) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    },

    get(endpoint, baseUrl = API_BASE_URL) {
        return this.request(endpoint, { method: 'GET' }, baseUrl);
    },

    post(endpoint, data, baseUrl = API_BASE_URL) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }, baseUrl);
    },

    put(endpoint, data, baseUrl = API_BASE_URL) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, baseUrl);
    },

    delete(endpoint, baseUrl = API_BASE_URL) {
        return this.request(endpoint, { method: 'DELETE' }, baseUrl);
    },

    // Auth endpoints (use /api/v1/auth/)
    login(credentials) {
        return this.post('/login/', credentials, AUTH_API_URL);
    },

    signup(data) {
        return this.post('/signup/', data, AUTH_API_URL);
    },

    logout() {
        return this.post('/logout/', {}, AUTH_API_URL);
    },

    // Hierarchy endpoints (use /api/v1/)
    getDomains() {
        return this.get('/domains/', ORGANIZATION_API_URL);
    },

    getOrganizations() {
        return this.get('/organizations/', ORGANIZATION_API_URL);
    },

    getDepartments() {
        return this.get('/departments/', ORGANIZATION_API_URL);
    },

    getWings() {
        return this.get('/wings/', ORGANIZATION_API_URL);
    },

    getHierarchyMembers() {
        return this.get('/hierarchy-members/', AUTH_API_URL);
    },

    // User endpoints (use /api/v1/auth/)
    getUsers() {
        return this.get('/users/', AUTH_API_URL);
    },

    getUser(id) {
        return this.get(`/users/${id}/`, AUTH_API_URL);
    },

    updateUser(id, data) {
        return this.put(`/users/${id}/`, data, AUTH_API_URL);
    },

    deleteUser(id) {
        return this.delete(`/users/${id}/`, AUTH_API_URL);
    },

    // Token endpoints (use /api/v1/auth/token/)
    getTokens() {
        return this.get('/token/', AUTH_API_URL);
    },

    createToken(data) {
        return this.post('/token/', data, AUTH_API_URL);
    },

    revokeToken(id) {
        return this.delete(`/token/${id}/`, AUTH_API_URL);
    },
};

export default api;
