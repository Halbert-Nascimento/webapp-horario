import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3333",
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
	(config) => {
		// Buscar token do localStorage
		const token = localStorage.getItem("@GradeHorario:token");

		// Se existir token, adicionar ao header Authorization
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Se receber 401 (não autorizado), limpar sessão e redirecionar
		if (error.response?.status === 401) {
			const currentPath = window.location.pathname;

			// Só limpar se não estiver na página de login
			if (currentPath !== "/login") {
				localStorage.removeItem("@GradeHorario:token");
				localStorage.removeItem("@GradeHorario:user");

				// Redirecionar para login
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

export default api;
