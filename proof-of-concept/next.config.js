/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

module.exports = {
	env: {
		OPENAI_ORG: process.env.OPENAI_ORG,
		OPENAI_API: process.env.OPENAI_API,
	},
};
