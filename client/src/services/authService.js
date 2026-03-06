import api from './api';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
}

export async function registerStepOne(payload) {
  try {
    const response = await api.post('/auth/register/step1', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function registerStepTwo(payload) {
  try {
    const response = await api.post('/auth/register/step2', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function loginUser(payload) {
  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function forgotPassword(payload) {
  try {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function resetPassword(token, payload) {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export default {
  registerStepOne,
  registerStepTwo,
  loginUser,
  forgotPassword,
  resetPassword,
};
