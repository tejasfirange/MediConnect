import api from './api';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Unable to process assessment right now.';
}

export async function getCategories() {
  try {
    const language = localStorage.getItem('mediconnect-language') || 'en';
    const response = await api.get('/assessment/categories', {
      params: { language },
      headers: { 'x-language': language },
    });
    return response.data.categories || [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getInitialQuestion(category) {
  try {
    const language = localStorage.getItem('mediconnect-language') || 'en';
    const response = await api.get('/assessment/start', {
      params: { category, language },
      headers: { 'x-language': language },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function evaluateAssessment(category, answers) {
  try {
    const language = localStorage.getItem('mediconnect-language') || 'en';
    const response = await api.post(
      '/assessment/evaluate',
      { category, answers, language },
      {
        headers: {
          'x-language': language,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export default {
  getCategories,
  getInitialQuestion,
  evaluateAssessment,
};
