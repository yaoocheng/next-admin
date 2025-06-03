import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: "/api/admin3/:path*",
                destination: "http://192.168.5.201/admin3/:path*",
            },
            {
                source: "/api/user/v31/:path*",
                destination: "http://192.168.5.201/user/v31/:path*",
            },
        ];
    },
};

export default nextConfig;
