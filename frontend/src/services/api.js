import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

export const mindMapService = {
  getAllMindMaps: () => api.get('/mindmaps'),
  getMindMap: (id) => api.get(`/mindmaps/${id}`),
  createMindMap: (data) => api.post('/mindmaps', data),
  updateMindMap: (id, data) => api.put(`/mindmaps/${id}`, data),
  deleteMindMap: (id) => api.delete(`/mindmaps/${id}`)
};

export default api;
