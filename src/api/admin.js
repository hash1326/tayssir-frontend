import client from './client';

export const getDashboard = () =>
  client.get('/dashboard/admin/');

export const getAdminUsers = (params) =>
  client.get('/dashboard/users/', { params });

export const banUser = (id) =>
  client.post(`/dashboard/users/${id}/ban/`);
