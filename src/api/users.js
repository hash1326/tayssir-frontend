import client from './client';

export const getMe = () =>
  client.get('/users/me/');

export const updateMe = (data) =>
  client.patch('/users/me/', data);

export const updateProfile = (data) =>
  client.patch('/users/me/profile/', data);

export const changePassword = (data) =>
  client.post('/users/me/change-password/', data);

export const getTeachers = (params) =>
  client.get('/users/teachers/', { params });

export const getStudents = (params) =>
  client.get('/users/students/', { params });
