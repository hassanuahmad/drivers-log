"use client";

import {useUser} from "@clerk/nextjs";
import InstructorNavbar from "@/app/components/instructorNavbar";
import {useEffect} from "react";
import {User} from "@/app/types/global";

export default function InstructorLayout({
                                             children, // will be a page or nested layout
                                         }: {
    children: React.ReactNode;
}) {
    const {isSignedIn, user} = useUser();

    let userInfo: User = {
        instructorClerkId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailAddress: user?.primaryEmailAddress?.emailAddress,
    };

    const getUserInfo = async (value: User) => {
        try {
            const response = await fetch("/api/instructor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            getUserInfo(userInfo).then();
        }
    }, [isSignedIn]);


    return (
        <section>
            <InstructorNavbar/>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}
