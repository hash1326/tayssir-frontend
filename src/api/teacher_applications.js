import client from './client';

// Teacher submits application (multipart for file upload)
export const submitApplication = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') form.append(k, v);
  });
  return client.post('/teacher-applications/apply/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Admin
export const listApplications = (params) =>
  client.get('/teacher-applications/', { params });

export const reviewApplication = (id, status, admin_notes = '') =>
  client.patch(`/teacher-applications/${id}/`, { status, admin_notes });
