"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (isAuthenticated()) {
				router.push("/home");
			} else {
				router.push("/login");
			}
		}
	}, [loading, isAuthenticated, router]);

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900'></div>
				<p className='mt-4 text-gray-600'>Carregando...</p>
			</div>
		</div>
	);
}
