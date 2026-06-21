import { apiClient } from '@/lib/api-client';

export const verifyEmail = (token: string) =>
  apiClient.post('/auth/verify-email', { token });

export const resendVerification = (email: string) =>
  apiClient.post('/auth/resend-verification', { email });

export const forgotPassword = (email: string) =>
  apiClient.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, newPassword: string) =>
  apiClient.post('/auth/reset-password', { token, newPassword });

export const changePassword = (oldPassword: string, newPassword: string) =>
  apiClient.patch('/auth/change-password', { oldPassword, newPassword });