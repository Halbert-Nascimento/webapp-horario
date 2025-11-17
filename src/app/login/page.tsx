"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Login() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [loading, setLoading] = useState(false);

	const { login, isAuthenticated } = useAuth();
	const router = useRouter();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated()) {
			router.push("/home");
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !senha.trim()) {
			return;
		}

		setLoading(true);

		try {
			await login(email, senha);
			router.push("/home");
		} catch {
			// Error is handled in AuthContext with toast
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950'>
			<div className='w-full max-w-md px-6'>
				<div className='bg-white rounded-2xl shadow-2xl p-8'>
					{/* Logo */}
					<div className='flex justify-center mb-6'>
						<Image
							src='/logo-iesgo.png'
							width={150}
							height={56}
							alt='Logo IESGO'
							className='w-auto h-auto'
							priority
						/>
					</div>

					{/* Title */}
					<h1 className='text-2xl font-bold text-center text-gray-800 mb-2'>
						Sistema de Horários
					</h1>
					<p className='text-center text-gray-600 mb-8'>
						Faça login para acessar o sistema
					</p>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								E-mail
							</label>
							<input
								id='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
								placeholder='seu.email@exemplo.com'
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor='senha'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Senha
							</label>
							<input
								id='senha'
								type='password'
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								required
								className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
								placeholder='••••••••'
								disabled={loading}
							/>
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{loading ? "Entrando..." : "Entrar"}
						</button>
					</form>

					{/* Footer */}
					<p className='text-center text-sm text-gray-500 mt-6'>
						IESGO - Instituto de Ensino Superior de Goiás
					</p>
				</div>
			</div>
		</div>
	);
}
