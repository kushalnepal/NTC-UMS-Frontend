const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1/auth';

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

export const api = {
    async request(endpoint, options = {}) {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Auth endpoints
    login(credentials) {
        return this.post('/login/', credentials);
    },

    signup(data) {
        return this.post('/signup/', data);
    },

    logout() {
        return this.post('/logout/', {});
    },

    // Hierarchy endpoints
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
        return this.get('/hierarchy-members/');
    },

    // User endpoints
    getUsers() {
        return this.get('/users/');
    },

    getUser(id) {
        return this.get(`/users/${id}/`);
    },

    updateUser(id, data) {
        return this.put(`/users/${id}/`, data);
    },

    deleteUser(id) {
        return this.delete(`/users/${id}/`);
    },

    // Token endpoints
    getTokens() {
        return this.get('/tokens/');
    },

    createToken(data) {
        return this.post('/tokens/', data);
    },

    revokeToken(id) {
        return this.delete(`/tokens/${id}/`);
    },
};

export default api;
