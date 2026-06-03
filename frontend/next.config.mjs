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
        ]
    }
};

export default nextConfig;
