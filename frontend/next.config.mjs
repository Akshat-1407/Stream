/** @type {import('next').NextConfig} */
const nextConfig = {
      images:{
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                hostname: "image.tmdb.org"
            },
            {
                hostname: "localhost"
            }
            // {
            //     protocol: "http",
            //     hostname: "localhost",
            //     port: "8080",
            // },
            // {
            //     protocol: "http",
            //     hostname: "127.0.0.1",
            //     port: "8080",
            // },
        ]
    }
};

export default nextConfig;
