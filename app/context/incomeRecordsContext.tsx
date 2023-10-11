"use client";
import {createContext} from "react";
import {IncomeContextType} from "@/app/types/shared/records";

export const IncomeRecordsContext = createContext<IncomeContextType | null>(null);
