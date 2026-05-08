import client from './client';

export const login = (email, password) =>
  client.post('/auth/login/', { email, password });

export const register = (data) =>
  client.post('/auth/register/', data);

export const googleLogin = (idToken, role) =>
  client.post('/auth/google/', { id_token: idToken, role });

export const logout = (refresh) =>
  client.post('/auth/logout/', { refresh });

export const verifyEmail = (token) =>
  client.post('/auth/verify-email/', { token });

export const forgotPassword = (email) =>
  client.post('/auth/forgot-password/', { email });

export const resetPassword = (token, new_password) =>
  client.post('/auth/reset-password/', { token, new_password });

export const getMe = () =>
  client.get('/users/me/');
