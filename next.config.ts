import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		scrollRestoration: true,
	},
};

export default nextConfig;
