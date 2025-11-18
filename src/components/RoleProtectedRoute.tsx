"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface RoleProtectedRouteProps {
	children: React.ReactNode;
	allowedProfiles: number[];
	pageName?: string;
}

export default function RoleProtectedRoute({
	children,
	allowedProfiles,
	pageName = "esta página",
}: RoleProtectedRouteProps) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const hasShownToast = useRef(false);

	useEffect(() => {
		if (!loading && user) {
			if (!allowedProfiles.includes(user.perfil_id)) {
				if (!hasShownToast.current) {
					hasShownToast.current = true;
					toast.error(`Você não tem permissão para acessar ${pageName}`);
					router.push("/home");
				}
			}
		} else if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900'></div>
					<p className='mt-4 text-gray-600'>Carregando...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	if (!allowedProfiles.includes(user.perfil_id)) {
		return null;
	}

	return <>{children}</>;
}
