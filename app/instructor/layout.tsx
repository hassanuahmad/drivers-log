"use client";

import InstructorNavbar from "../components/instructorNavbar";
import { Dispatch, SetStateAction, createContext, useState } from "react";

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
