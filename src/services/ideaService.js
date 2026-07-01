import axiosClient from '../api/axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const ideaService = {
  create: async (ideaData) => {
    const response = await axiosClient.post('/ideas', ideaData);
    return response.data;
  },

  getAll: async (params) => {
    const response = await axiosClient.get('/ideas', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await axiosClient.get(`/ideas/${id}`);
    return response.data;
  },

  update: async (id, ideaData) => {
    const response = await axiosClient.get(`/ideas/${id}`); // Pre-fetch just in case, but standard is put:
    const putResponse = await axiosClient.put(`/ideas/${id}`, ideaData);
    return putResponse.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/ideas/${id}`);
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await axiosClient.put(`/ideas/${id}/favorite`);
    return response.data;
  },

  togglePin: async (id) => {
    const response = await axiosClient.put(`/ideas/${id}/pin`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await axiosClient.post(`/ideas/${id}/duplicate`);
    return response.data;
  },

  search: async (query, params) => {
    const response = await axiosClient.get('/ideas/search', { params: { query, ...params } });
    return response.data;
  },

  filter: async (filters, params) => {
    const response = await axiosClient.get('/ideas/filter', { params: { ...filters, ...params } });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosClient.get('/ideas/stats');
    return response.data;
  },

  getActivities: async () => {
    const response = await axiosClient.get('/ideas/activities');
    return response.data;
  },

  getRecent: async () => {
    const response = await axiosClient.get('/ideas/recent');
    return response.data;
  },

  getFavorites: async () => {
    const response = await axiosClient.get('/ideas/favorites');
    return response.data;
  },

  getCalendar: async () => {
    const response = await axiosClient.get('/ideas/calendar');
    return response.data;
  },

  exportPdf: (email) => {
    window.open(`${API_BASE_URL}/ideas/export/pdf?email=${encodeURIComponent(email)}`, '_blank');
  },

  exportExcel: (email) => {
    window.open(`${API_BASE_URL}/ideas/export/excel?email=${encodeURIComponent(email)}`, '_blank');
  },

  exportCsv: (email) => {
    window.open(`${API_BASE_URL}/ideas/export/csv?email=${encodeURIComponent(email)}`, '_blank');
  },
};

export default ideaService;
