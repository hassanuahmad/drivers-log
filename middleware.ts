import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/homepage/home"],
});

export const config = {
    matcher: ["/instructor/:path*"],
};
