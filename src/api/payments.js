import client from './client';

export const checkout = (courseId) =>
  client.post('/payments/checkout/', { course_id: courseId });

export const getMyPurchases = () =>
  client.get('/payments/my-purchases/');

export const getPurchase = (id) =>
  client.get(`/payments/${id}/`);

// Admin
export const adminGetPurchases = (params) =>
  client.get('/payments/admin/purchases/', { params });

export const adminApprovePurchase = (id, adminNote = '') =>
  client.post(`/payments/admin/${id}/approve/`, { admin_note: adminNote });

export const adminRejectPurchase = (id, reason) =>
  client.post(`/payments/admin/${id}/reject/`, { reason });

export const adminGetPayouts = (params) =>
  client.get('/payments/admin/payouts/', { params });

export const adminMarkPayoutPaid = (id, data) =>
  client.post(`/payments/admin/payouts/${id}/mark-paid/`, data);

// Teacher
export const getMyEarnings = () =>
  client.get('/payments/teachers/me/earnings/');

export const getMyPayouts = () =>
  client.get('/payments/teachers/me/payouts/');

export const getMyWithdrawRequests = () =>
  client.get('/payments/teachers/me/withdraw-requests/');

export const submitWithdrawRequest = (data) =>
  client.post('/payments/teachers/me/withdraw-requests/', data);

// Admin
export const adminGetWithdrawRequests = (params) =>
  client.get('/payments/admin/withdraw-requests/', { params });

export const adminReviewWithdrawRequest = (id, action, adminNote = '') =>
  client.post(`/payments/admin/withdraw-requests/${id}/review/`, { action, admin_note: adminNote });
