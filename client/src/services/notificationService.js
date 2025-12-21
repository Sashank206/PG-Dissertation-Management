import api from '../config/api';

const notificationService = {
    getNotifications: async () => {
        return api.get('/notifications');
    },

    markAsRead: async (id) => {
        return api.put(`/notifications/${id}/read`);
    }
};

export default notificationService;
