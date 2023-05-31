import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/homepage"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
