"use client";
import {createContext} from "react";
import {InstructorIdContextType} from "@/app/types/global";

export const InstructorIdContext = createContext<InstructorIdContextType>({
    instructorId: null,
    setInstructorId: null,
});
