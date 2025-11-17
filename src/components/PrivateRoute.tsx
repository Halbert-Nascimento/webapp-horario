"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
	children: React.ReactNode;
	roles?: string[] | number[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
	const { user, loading, hasRole } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				router.push("/login");
			} else if (roles && !hasRole(roles)) {
				// User doesn't have required role - could redirect to access denied page
				router.push("/home");
			}
		}
	}, [user, loading, roles, hasRole, router]);

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

	if (roles && !hasRole(roles)) {
		return null;
	}

	return <>{children}</>;
}
