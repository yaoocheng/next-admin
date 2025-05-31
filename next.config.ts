import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: "/api/admin3/:path*",
                destination: "http://82.156.35.239/admin3/:path*",
            },
            {
                source: "/api/user/v31/:path*",
                destination: "https://oh.murphysec.com/user/v31/:path*",
            },
        ];
    },
};

export default nextConfig;
