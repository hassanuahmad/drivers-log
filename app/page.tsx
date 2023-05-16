"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
    const router = useRouter();
    const { isSignedIn, sessionId, userId } = useAuth();

    if (isSignedIn) router.push("/instructor/dashboard");
    else router.push("/homepage/home");
}
