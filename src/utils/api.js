const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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
        return this.post('/auth/login/', credentials, API_BASE_URL);
    },

    signup(data) {
        return this.post('/auth/signup/', data, API_BASE_URL);
    },

    logout() {
        return this.post('/auth/logout/', {}, API_BASE_URL);
    },

    // Hierarchy endpoints (use /api/v1/)
    getDomains() {
        return this.get('/domains/');
    },

    getOrganizations() {
        return this.get('/organizations/');
    },

    getDepartments() {
        return this.get('/departments/');
    },

    getWings() {
        return this.get('/wings/');
    },

    getHierarchyMembers() {
        return this.get('/auth/hierarchy-members/');
    },

    // User endpoints (use /api/v1/auth/)
    getUsers() {
        return this.get('/auth/users/');
    },

    getUser(id) {
        return this.get(`/auth/users/${id}/`);
    },

    updateUser(id, data) {
        return this.put(`/auth/users/${id}/`, data);
    },

    deleteUser(id) {
        return this.delete(`/auth/users/${id}/`);
    },

    // Token endpoints (use /api/v1/auth/token/)
    getTokens() {
        return this.get('/auth/token/', API_BASE_URL);
    },

    createToken(data) {
        return this.post('/auth/token/', data, API_BASE_URL);
    },

    revokeToken(id) {
        return this.delete(`/auth/token/${id}/`);
    },
};

export default api;
