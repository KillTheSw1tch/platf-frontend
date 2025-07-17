import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ правильный ключ
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const getNotificationStatus = async () => {
  const response = await api.get('/user/notifications-toggle/');
  return response.data;
};

export const setNotificationStatus = async (enabled) => {
  const response = await api.post('/user/notifications-toggle/', {
    notifications_enabled: enabled,
  });
  return response.data;
};


