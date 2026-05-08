import client from './client';

// Public listing
export const getCourses = (params) =>
  client.get('/courses/', { params });

export const getCourse = (slug) =>
  client.get(`/courses/${slug}/`);

export const createCourse = (data) => {
  const isFile = data instanceof FormData;
  return client.post('/courses/', data, isFile ? {
    headers: { 'Content-Type': 'multipart/form-data' },
  } : undefined);
};

export const updateCourse = (slug, data) =>
  client.patch(`/courses/${slug}/`, data);

export const deleteCourse = (slug) =>
  client.delete(`/courses/${slug}/`);

export const enrollCourse = (slug) =>
  client.post(`/courses/${slug}/enroll/`);

export const unenrollCourse = (slug) =>
  client.post(`/courses/${slug}/unenroll/`);

export const getCourseStudents = (slug) =>
  client.get(`/courses/${slug}/students/`);

// User-scoped
export const getMyCourses = () =>
  client.get('/courses/mine/');

export const getMyEnrollments = () =>
  client.get('/courses/enrollments/');

// Categories
export const getCategories = () =>
  client.get('/courses/categories/');

// Dashboards
export const getStudentDashboard = () =>
  client.get('/dashboard/student/');

export const getTeacherDashboard = () =>
  client.get('/dashboard/teacher/');

export const getAdminDashboard = () =>
  client.get('/dashboard/admin/');
