import client from './client';

export const getCourseAssignments = (courseId) =>
  client.get(`/courses/${courseId}/assignments/`);

export const getAssignment = (id) =>
  client.get(`/assignments/${id}/`);

export const createAssignment = (courseId, data) =>
  client.post(`/courses/${courseId}/assignments/`, data);

export const updateAssignment = (id, data) =>
  client.patch(`/assignments/${id}/`, data);

export const deleteAssignment = (id) =>
  client.delete(`/assignments/${id}/`);

export const submitAssignment = (assignmentId, data) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  return client.post(`/assignments/${assignmentId}/submit/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMySubmissions = () =>
  client.get('/submissions/mine/');

export const gradeSubmission = (submissionId, data) =>
  client.patch(`/submissions/${submissionId}/grade/`, data);
