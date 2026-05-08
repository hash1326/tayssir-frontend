import client from './client';

export const getForumThreads = (params) =>
  client.get('/forum/threads/', { params });

export const getThread = (id) =>
  client.get(`/forum/threads/${id}/`);

export const createThread = (data) =>
  client.post('/forum/threads/', data);

export const updateThread = (id, data) =>
  client.patch(`/forum/threads/${id}/`, data);

export const deleteThread = (id) =>
  client.delete(`/forum/threads/${id}/`);

export const getReplies = (threadId) =>
  client.get(`/forum/threads/${threadId}/replies/`);

export const createReply = (threadId, body) =>
  client.post(`/forum/threads/${threadId}/replies/`, { body });

export const deleteReply = (id) =>
  client.delete(`/forum/replies/${id}/`);
