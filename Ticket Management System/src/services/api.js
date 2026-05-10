import axios from 'axios';

const API = axios.create({
    baseURL: 'https://ticket-management-system-1-8q08.onrender.com'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
