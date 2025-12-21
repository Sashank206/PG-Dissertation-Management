import api from '../config/api';

const submissionService = {
  // STUDENT: submit dissertation
  submitDissertation: async (formData) => {
    const res = await api.post('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // STUDENT: view own submissions/status
  getMySubmissions: async () => {
    const res = await api.get('/submissions');
    return Array.isArray(res.data) ? res.data : [];
  },

  // SUPERVISOR / ADMIN
  getDissertations: async () => {
    const res = await api.get('/submissions');
    return Array.isArray(res.data) ? res.data : [];
  },

  // SUPERVISOR: approve / reject
  reviewSubmission: async (id, data) => {
    const res = await api.put(`/submissions/${id}/review`, data);
    return res.data;
  },

  // ADMIN: get all submissions
  getAllSubmissions: async () => {
    const res = await api.get('/submissions');
    return res;
  }

};




export default submissionService;
