import client from './client';

export const getCourseLessons = (courseId) =>
  client.get(`/courses/${courseId}/lessons/`);

export const getLesson = (id) =>
  client.get(`/lessons/${id}/`);

export const createLesson = (courseId, data) =>
  client.post(`/courses/${courseId}/lessons/`, data);

export const updateLesson = (id, data) =>
  client.patch(`/lessons/${id}/`, data);

export const deleteLesson = (id) =>
  client.delete(`/lessons/${id}/`);

export const getNotes = () =>
  client.get('/notes/');

export const createNote = (lessonId, content) =>
  client.post('/notes/', { lesson: lessonId, content });

export const updateNote = (id, content) =>
  client.patch(`/notes/${id}/`, { content });

export const deleteNote = (id) =>
  client.delete(`/notes/${id}/`);
