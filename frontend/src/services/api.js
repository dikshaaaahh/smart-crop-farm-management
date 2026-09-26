const API_BASE_URL = 'https://smart-crop-farm-backend.vercel.app/api';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.message ||
        `Request failed with status ${response.status}`;

      const error = new Error(message);
      error.validationErrors = errorData.validationErrors;
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(`API call error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchJson('/health'),

  // Dashboard
  getDashboardStats: () => fetchJson('/dashboard/stats'),

  // Farms
  getFarms: () => fetchJson('/farms'),
  getFarmById: (id) => fetchJson(`/farms/${id}`),
  createFarm: (farm) =>
    fetchJson('/farms', {
      method: 'POST',
      body: JSON.stringify(farm),
    }),
  updateFarm: (id, farm) =>
    fetchJson(`/farms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(farm),
    }),
  deleteFarm: (id) =>
    fetchJson(`/farms/${id}`, {
      method: 'DELETE',
    }),

  // Crops
  getCrops: () => fetchJson('/crops'),
  getCropById: (id) => fetchJson(`/crops/${id}`),
  getCropByName: (name) =>
    fetchJson(`/crops/name/${encodeURIComponent(name)}`),

  // Recommendation Engine
  getCropRecommendations: (payload) =>
    fetchJson('/recommendations/crop', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Fertilizer Guidance Engine
  getFertilizerGuidance: (payload) =>
    fetchJson('/fertilizer/guidance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Irrigation Guidance Engine
  getIrrigationGuidance: (payload) =>
    fetchJson('/irrigation/guidance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Activity Tracking
  getActivities: (params = {}) => {
    const query = new URLSearchParams();

    if (params.farmId) query.append('farmId', params.farmId);
    if (params.cropName) query.append('cropName', params.cropName);
    if (params.status) query.append('status', params.status);

    const qs = query.toString() ? `?${query.toString()}` : '';

    return fetchJson(`/activities${qs}`);
  },

  getActivityById: (id) =>
    fetchJson(`/activities/${id}`),

  createActivity: (activity) =>
    fetchJson('/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    }),

  updateActivity: (id, activity) =>
    fetchJson(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activity),
    }),

  updateActivityStatus: (id, status) =>
    fetchJson(
      `/activities/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PATCH',
      }
    ),

  deleteActivity: (id) =>
    fetchJson(`/activities/${id}`, {
      method: 'DELETE',
    }),

  // Expense Management
  getExpenses: (params = {}) => {
    const query = new URLSearchParams();

    if (params.farmId) query.append('farmId', params.farmId);
    if (params.category) query.append('category', params.category);

    const qs = query.toString() ? `?${query.toString()}` : '';

    return fetchJson(`/expenses${qs}`);
  },

  createExpense: (expense) =>
    fetchJson('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  updateExpense: (id, expense) =>
    fetchJson(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),

  deleteExpense: (id) =>
    fetchJson(`/expenses/${id}`, {
      method: 'DELETE',
    }),

  getExpenseSummary: () =>
    fetchJson('/expenses/summary'),

  // Labour Diary
  getLabourRecords: () =>
    fetchJson('/labour-records'),

  getLabourRecordById: (id) =>
    fetchJson(`/labour-records/${id}`),

  createLabourRecord: (record) =>
    fetchJson('/labour-records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  updateLabourRecord: (id, record) =>
    fetchJson(`/labour-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    }),

  deleteLabourRecord: (id) =>
    fetchJson(`/labour-records/${id}`, {
      method: 'DELETE',
    }),

  searchLabourByName: (name) =>
    fetchJson(
      `/labour-records/search?name=${encodeURIComponent(name)}`
    ),

  searchLabourByDate: (date) =>
    fetchJson(`/labour-records/date?date=${date}`),
};