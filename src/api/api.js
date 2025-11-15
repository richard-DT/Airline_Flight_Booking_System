import axios from "axios";

// Choose baseURL depending on environment
const baseURL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_LOCAL
    : import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_PROD;

// Create Axios instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


export default api;
