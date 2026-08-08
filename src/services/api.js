import axios from 'axios'

// Centralized Axios instance.
// This project uses local JSON data, but Axios is wired up here so the app
// can be pointed at a real backend later by simply changing the baseURL.
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
