"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function LoginPage() {
	const { login, isLoading: authLoading } = useAuth();
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email.trim() || !senha.trim()) {
			return;
		}

		try {
			setLoading(true);
			await login({ email, senha });
		} catch (error) {
			// Erro já tratado no AuthContext
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
				<div className="text-white text-xl">Carregando...</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
			<div className="w-full max-w-md px-6">
				{/* Card de Login */}
				<div className="bg-white rounded-2xl shadow-2xl p-8">
					{/* Logo e Título */}
					<div className="flex flex-col items-center mb-8">
						<Image
							src="/logo-iesgo.png"
							width={150}
							height={56}
							alt="Logo IESGO"
							className="mb-4"
							style={{ width: "auto", height: "auto" }}
							priority
						/>
						<h1 className="text-2xl font-bold text-gray-800 text-center">
							Sistema de Grade Horária
						</h1>
						<p className="text-gray-600 text-sm mt-2">
							Entre com suas credenciais
						</p>
					</div>

					{/* Formulário */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Campo Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="seu@email.com"
								disabled={loading}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
							/>
						</div>

						{/* Campo Senha */}
						<div>
							<label
								htmlFor="senha"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Senha
							</label>
							<input
								id="senha"
								type="password"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								placeholder="••••••••"
								disabled={loading}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
							/>
						</div>

						{/* Botão Entrar */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Entrando...
								</>
							) : (
								"Entrar"
							)}
						</button>
					</form>

					{/* Informações de Perfil */}
					<div className="mt-8 pt-6 border-t border-gray-200">
						<p className="text-xs text-gray-500 text-center mb-3">
							Perfis de Acesso:
						</p>
						<div className="grid grid-cols-3 gap-2 text-xs">
							<div className="text-center p-2 bg-purple-50 rounded">
								<span className="font-semibold text-purple-700">Admin</span>
								<p className="text-gray-600 mt-1">Acesso Total</p>
							</div>
							<div className="text-center p-2 bg-blue-50 rounded">
								<span className="font-semibold text-blue-700">
									Coordenador
								</span>
								<p className="text-gray-600 mt-1">Gestão</p>
							</div>
							<div className="text-center p-2 bg-green-50 rounded">
								<span className="font-semibold text-green-700">Professor</span>
								<p className="text-gray-600 mt-1">Leitura</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<p className="text-center text-white text-sm mt-6 opacity-80">
					© 2025 IESGO - Sistema de Grade Horária
				</p>
			</div>
		</div>
	);
}
