import axios from 'axios'

// Backend ka base URL env se aata hai (trailing slash ho to hata do)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

const API = axios.create({
  baseURL: `${API_URL}/api`
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API