"use client";
import { createContext } from "react";
import { LessonContextType } from "@/app/types/shared/records";

export const LessonRecordsContext = createContext<LessonContextType | null>(
    null,
);
