"use client";
import { createContext } from "react";
import { RoadTestContextType } from "../types/shared/records";

export const RoadTestRecordsContext = createContext<RoadTestContextType | null>(
    null,
);
