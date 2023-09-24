"use client";

import {useUser} from "@clerk/nextjs";
import InstructorNavbar from "../components/instructorNavbar";
import {useEffect, useState} from "react";
import {User} from "@/app/types/global";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

export default function VehicleMaintenanceLayout({
                                                     children, // will be a page or nested layout
                                                 }: {
    children: React.ReactNode;
}) {
    const [instructorId, setInstructorId] = useState(null);
    const {isSignedIn, user} = useUser();

    let userInfo: User = {
        googleId: user?.id,
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
            if (response.ok) {
                // If user is created, get user info
                const response = await fetch(
                    `/api/instructor/${value.googleId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const {id} = await response.json();
                    if (setInstructorId) setInstructorId(id);
                }
            }
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
        <InstructorIdContext.Provider value={{instructorId, setInstructorId}}>
            <section>
                <InstructorNavbar/>
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </section>
        </InstructorIdContext.Provider>
    );
}
