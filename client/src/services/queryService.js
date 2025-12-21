import api from "../config/api"; // or ../config/axios (use the one that exists)

const queryService = {
  getQueries: async () => {
    const res = await api.get("/queries");
    return res.data;
  },

  createQuery: async (data) => {
    const res = await api.post("/queries", data);
    return res.data;
  },

  markPending: async (id) => {
    const res = await api.put(`/queries/${id}/pending`);
    return res.data;
  },

  answerQuery: async (id, response) => {
    const res = await api.put(`/queries/${id}/answer`, { response });
    return res.data;
  }
};

export default queryService;
