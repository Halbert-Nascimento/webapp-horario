import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3001",
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle 401 errors (token expired/invalid)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid - clear auth data
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			
			// Only redirect to login if not already on login page
			if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default api;
