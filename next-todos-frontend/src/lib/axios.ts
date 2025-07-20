import axios from "axios";
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use((config) => {
    const token = Cookies.get('token'); // Ambil token dari cookies
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No token found in cookies, requests will not be authenticated');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;