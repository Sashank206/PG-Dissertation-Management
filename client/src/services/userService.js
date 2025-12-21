import api from '../config/api';

const userService = {
    getAllUsers: async () => {
        return api.get('/users');
    },

    createUser: async (userData) => {
        return api.post('/users', userData);
    },

    updateUser: async (id, userData) => {
        return api.put(`/users/${id}`, userData);
    },

    deleteUser: async (id) => {
        return api.delete(`/users/${id}`);
    },

    // Potential helper to get departments if needed for dropdowns
    getDepartments: async () => {
        return api.get('/departments');
    },

    getUserById: async (id) => {
        return api.get(`/admin/users/${id}`);
    },

    updateUser: async (id, data) => {
        return api.put(`/admin/users/${id}`, data);
    }
};

export default userService;
