"use client";
import {createContext} from "react";
import {StudentContextType} from "@/app/types/shared/records";

export const StudentRecordsContext = createContext<StudentContextType | null>(null);
