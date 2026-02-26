// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/API/v1.0.0", // your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
