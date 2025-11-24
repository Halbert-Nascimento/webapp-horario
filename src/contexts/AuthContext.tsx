"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import {
	User,
	LoginCredentials,
	AuthResponse,
	AuthContextType,
} from "@/interfaces/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	// Restaurar sessão do localStorage ao carregar
	useEffect(() => {
		const storedToken = localStorage.getItem("@GradeHorario:token");
		const storedUser = localStorage.getItem("@GradeHorario:user");

		if (storedToken && storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setToken(storedToken);
				setUser(parsedUser);
			} catch (error) {
				localStorage.removeItem("@GradeHorario:token");
				localStorage.removeItem("@GradeHorario:user");
			}
		}
		setIsLoading(false);
	}, []);

	// Função de login
	const login = async (credentials: LoginCredentials) => {
		try {
			const response = await api.post<AuthResponse>("/auth/login", credentials);

			const { token, user } = response.data;

			// Salvar no localStorage
			localStorage.setItem("@GradeHorario:token", token);
			localStorage.setItem("@GradeHorario:user", JSON.stringify(user));

			// Atualizar estado
			setToken(token);
			setUser(user);

			toast.success(`Bem-vindo(a), ${user.nomeUsuario}!`);

			// Redirecionar para home
			router.push("/home");
		} catch (error: any) {
			let mensagemErro = "Erro ao fazer login";

			if (error.response?.data?.message) {
				mensagemErro = error.response.data.message;
			} else if (error.response?.status === 401) {
				mensagemErro = "Email ou senha incorretos";
			} else if (error.response?.status === 403) {
				mensagemErro = "Sua conta está inativa. Contate o administrador.";
			}

			toast.error(mensagemErro);
			throw error;
		}
	};

	// Função de logout
	const logout = () => {
		localStorage.removeItem("@GradeHorario:token");
		localStorage.removeItem("@GradeHorario:user");
		setToken(null);
		setUser(null);
		toast.success("Logout realizado com sucesso!");
		router.push("/login");
	};

	const isAuthenticated = !!token && !!user;

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				isAuthenticated,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// Hook customizado para usar o contexto
export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}

	return context;
}
