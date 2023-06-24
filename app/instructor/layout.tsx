"use client";

import { useUser } from "@clerk/nextjs";
import InstructorNavbar from "../components/instructorNavbar";
import {
    Dispatch,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from "react";
import { User } from "./dashboard/page";

export interface InstructorIdContextType {
    instructorId: number | null;
    setInstructorId: Dispatch<SetStateAction<null>> | null;
}

export const InstructorIdContext = createContext<InstructorIdContextType>({
    instructorId: null,
    setInstructorId: null,
});

export default function VehicleMaintenanceLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    const [instructorId, setInstructorId] = useState(null);
    const { isSignedIn, user } = useUser();

    let userInfo: User = {
        googleId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailAddress: user?.primaryEmailAddress?.emailAddress,
    };

    const createUser = async (value: User) => {
        try {
            const response = await fetch("/api/instructor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });
            if (response.ok) {
                // console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async (
        value: User,
        { instructorId, setInstructorId }: InstructorIdContextType
    ) => {
        try {
            const response = await fetch(`/api/instructor/${value.googleId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const { id } = await response.json();
                if (setInstructorId) setInstructorId(id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isSignedIn) {
        createUser(userInfo);

        getUser(userInfo, { instructorId, setInstructorId });
    }

    return (
        <InstructorIdContext.Provider value={{ instructorId, setInstructorId }}>
            <section>
                <InstructorNavbar />
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </section>
        </InstructorIdContext.Provider>
    );
}
