import client from './client';

export const getNotifications = (params) =>
  client.get('/notifications/', { params });

export const markNotificationRead = (id) =>
  client.post(`/notifications/${id}/read/`);

export const markAllRead = () =>
  client.post('/notifications/mark-all-read/');

export const getUnreadCount = () =>
  client.get('/notifications/unread-count/');
