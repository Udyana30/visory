/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/comic/**',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
