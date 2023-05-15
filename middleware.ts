import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

// TODO: This currently makes all pages protected with login
// TODO: - Fix this so then we have public pages and private pages

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
