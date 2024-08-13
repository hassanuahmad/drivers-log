/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: true,
    },
};

module.exports = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "https://www.driverslog.app/",
                permanent: true,
            },
        ];
    },
    ...nextConfig,
};

// module.exports = nextConfig;
