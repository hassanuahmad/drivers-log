"use client";
import {ReactNode, useContext, useEffect, useState} from "react";
import {VehicleMaintenanceRecordsContext} from "./vehicleMaintenanceRecordsContext";
import {calculateTotals} from "../instructor/vehicle-maintenance/utils";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

export const VehicleMaintenanceProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const {instructorId} =
        useContext(InstructorIdContext);

    const monthOptions = [
        {label: "Jan", value: "01"},
        {label: "Feb", value: "02"},
        {label: "Mar", value: "03"},
        {label: "Apr", value: "04"},
        {label: "May", value: "05"},
        {label: "Jun", value: "06"},
        {label: "Jul", value: "07"},
        {label: "Aug", value: "08"},
        {label: "Sep", value: "09"},
        {label: "Oct", value: "10"},
        {label: "Nov", value: "11"},
        {label: "Dec", value: "12"},
    ];

    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalGas, setTotalGas] = useState<number>(0);
    const [totalMaintenance, setTotalMaintenance] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/${instructorId}/vehicle-maintenance/${selectedMonth}/${selectedYear}`
                );
                const data = await response.json();
                setRecords(data.records);
                const totals = calculateTotals(data.records);
                setTotalGas(totals.totalGas);
                setTotalMaintenance(totals.totalMaintenance);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [instructorId, selectedMonth, selectedYear]);

    const context = {
        records,
        setRecords,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        totalGas,
        setTotalGas,
        totalMaintenance,
        setTotalMaintenance,
    };

    return (
        <VehicleMaintenanceRecordsContext.Provider value={context}>
            {children}
        </VehicleMaintenanceRecordsContext.Provider>
    );
};
