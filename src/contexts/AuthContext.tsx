"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "@/services/auth";
import { User, AuthContextType } from "@/interfaces/types";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is already logged in
		const savedUser = authService.getStoredUser();
		const savedToken = authService.getStoredToken();

		if (savedUser && savedToken) {
			setUser(savedUser);
		}

		setLoading(false);
	}, []);

	const login = async (email: string, senha: string): Promise<User> => {
		try {
			const data = await authService.login({ email, senha });

			authService.saveAuthData(data.token, data.user);
			setUser(data.user);

			toast.success("Login realizado com sucesso!");

			return data.user;
		} catch (error) {
			const message =
				(error as { response?: { data?: { message?: string } } })
					.response?.data?.message || "Erro ao fazer login";
			toast.error(message);
			throw error;
		}
	};

	const logout = () => {
		authService.clearAuthData();
		setUser(null);
		toast.success("Logout realizado com sucesso!");
	};

	const isAuthenticated = (): boolean => {
		return user !== null;
	};

	const hasRole = (roles: string[] | number[] | string | number): boolean => {
		if (!user) return false;

		const allowedRoles = Array.isArray(roles) ? roles : [roles];

		return (
			allowedRoles.includes(user.perfil) ||
			allowedRoles.includes(user.perfil_id)
		);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				isAuthenticated,
				hasRole,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
