import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/homepage/home", "/homepage/pricing", "/homepage/about-us"],
});

export const config = {
    // matcher: ["/instructor/:path*"],
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
