import client from './client';

export const getCourseLiveSessions = (courseId) =>
  client.get(`/courses/${courseId}/live-sessions/`);

export const createLiveSession = (courseId, data) =>
  client.post(`/courses/${courseId}/live-sessions/`, data);

export const getLiveSession = (id) =>
  client.get(`/live-sessions/${id}/`);

export const updateLiveSession = (id, data) =>
  client.patch(`/live-sessions/${id}/`, data);

export const cancelLiveSession = (id) =>
  client.delete(`/live-sessions/${id}/`);

export const joinLiveSession = (id) =>
  client.post(`/live-sessions/${id}/join/`);

export const leaveLiveSession = (id) =>
  client.post(`/live-sessions/${id}/leave/`);

export const endLiveSession = (id) =>
  client.post(`/live-sessions/${id}/end/`);

export const getLiveSessionAttendance = (id) =>
  client.get(`/live-sessions/${id}/attendance/`);
