import api from "./api";
import { LoginCredentials, LoginResponse, User } from "@/interfaces/types";

export const authService = {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await api.post<LoginResponse>("/auth/login", credentials);
		return response.data;
	},

	saveAuthData(token: string, user: User): void {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
	},

	clearAuthData(): void {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	getStoredUser(): User | null {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : null;
	},

	getStoredToken(): string | null {
		return localStorage.getItem("token");
	},

	isAuthenticated(): boolean {
		return this.getStoredToken() !== null;
	},
};
