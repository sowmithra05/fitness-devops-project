import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

// Request interceptor to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ✅ Updated authService with isAdmin support
export const authService = {
  login: (email, password, isAdmin = false) =>
    API.post('/auth/login', { email, password, isAdmin }),

  signup: (userData) => API.post('/auth/signup', userData),

  setToken: (token) => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete API.defaults.headers.common['Authorization']
    }
  },
}

export const userService = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (profileData) => API.put('/user/profile', profileData),
}

export const activityService = {
  getAll: () => API.get('/activities'),
  create: (activityData) => API.post('/activities', activityData),
  update: (id, activityData) => API.put(`/activities/${id}`, activityData),
  delete: (id) => API.delete(`/activities/${id}`),
}

export const nutritionService = {
  getByDate: (date) => API.get(`/nutrition?date=${date}`),
  create: (nutritionData) => API.post('/nutrition', nutritionData),
  getGoals: () => API.get('/nutrition/goals'),
  createGoal: (goalData) => API.post('/nutrition/goals', goalData),
  updateGoal: (id, goalData) => API.put(`/nutrition/goals/${id}`, goalData),
  deleteGoal: (id) => API.delete(`/nutrition/goals/${id}`),
}

export default API
