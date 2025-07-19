import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    }
})

export default api;