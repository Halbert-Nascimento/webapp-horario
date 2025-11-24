"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[]; // Se não definido, apenas autenticação é necessária
}

export default function ProtectedRoute({
	children,
	allowedRoles,
}: ProtectedRouteProps) {
	const { isAuthenticated, user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			// Se não está autenticado, redirecionar para login
			if (!isAuthenticated) {
				router.replace("/login");
				return;
			}

			// Se roles são requeridas, verificar se o usuário tem permissão
			if (allowedRoles && allowedRoles.length > 0 && user) {
				const hasPermission = user.roles.some((role) =>
					allowedRoles.includes(role)
				);

				// Se não tem permissão, redirecionar para home ou página de acesso negado
				if (!hasPermission) {
					router.replace("/home");
					return;
				}
			}
		}
	}, [isAuthenticated, isLoading, user, allowedRoles, router]);

	// Mostrar loading enquanto verifica autenticação
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Verificando autenticação...</p>
				</div>
			</div>
		);
	}

	// Se não está autenticado, não renderizar nada (redirecionamento acontecerá)
	if (!isAuthenticated) {
		return null;
	}

	// Se roles são requeridas, verificar permissão
	if (allowedRoles && allowedRoles.length > 0 && user) {
		const hasPermission = user.roles.some((role) => allowedRoles.includes(role));

		if (!hasPermission) {
			return null;
		}
	}

	// Se passou por todas as verificações, renderizar o conteúdo
	return <>{children}</>;
}
