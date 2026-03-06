import api from './api';

function getErrorMessage(error) {
  return error?.response?.data?.message || 'Unable to fetch history right now.';
}

export async function getPatientHistory() {
  try {
    const response = await api.get('/patient/history');
    return response.data.reports || [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getPatientHistoryById(id) {
  try {
    const response = await api.get(`/patient/history/${id}`);
    return response.data.report;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export default {
  getPatientHistory,
  getPatientHistoryById,
};
