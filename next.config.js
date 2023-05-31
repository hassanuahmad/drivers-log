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
                destination: "/homepage/home",
                permanent: true,
            },
        ];
    },
    ...nextConfig,
};

// module.exports = nextConfig;
