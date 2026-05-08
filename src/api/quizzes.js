import client from './client';

export const getCourseQuizzes = (courseSlug) =>
  client.get(`/courses/${courseSlug}/quizzes/`);

export const createQuiz = (courseSlug, data) =>
  client.post(`/courses/${courseSlug}/quizzes/`, data);

export const getQuiz = (quizId) =>
  client.get(`/quizzes/${quizId}/`);

export const updateQuiz = (quizId, data) =>
  client.patch(`/quizzes/${quizId}/`, data);

export const deleteQuiz = (quizId) =>
  client.delete(`/quizzes/${quizId}/`);

export const submitQuizAttempt = (quizId, answers) =>
  client.post(`/quizzes/${quizId}/attempt/`, { answers });

export const getMyAttempt = (quizId) =>
  client.get(`/quizzes/${quizId}/my-attempt/`);

export const getQuizAttempts = (quizId) =>
  client.get(`/quizzes/${quizId}/attempts/`);
