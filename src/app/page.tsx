"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated) {
				router.replace("/home");
			} else {
				router.replace("/login");
			}
		}
	}, [isAuthenticated, isLoading, router]);

	// Mostrar loading enquanto verifica
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-600">Carregando...</p>
			</div>
		</div>
	);
}
