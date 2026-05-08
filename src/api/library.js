import client from './client';

export const getDocuments = (params) => client.get('/library/', { params });
export const getDocument = (id) => client.get(`/library/${id}/`);
export const createDocument = (data) =>
  client.post('/library/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateDocument = (id, data) => client.patch(`/library/${id}/`, data);
export const deleteDocument = (id) => client.delete(`/library/${id}/`);
