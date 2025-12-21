import api from '../config/api';

const feedbackService = {
    addFeedback: async (feedbackData) => {
        return api.post('/feedback', feedbackData);
    },

    getFeedbacks: async () => {
        return api.get('/feedback');
    }
};

export default feedbackService;
