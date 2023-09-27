"use client";
import {createContext} from "react";
import {VehicleMaintenanceContextType} from "@/app/types/shared/records";

export const VehicleMaintenanceRecordsContext = createContext<VehicleMaintenanceContextType | null>(null);
