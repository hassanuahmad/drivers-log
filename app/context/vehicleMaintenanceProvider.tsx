"use client";
import {ReactNode, useContext, useEffect, useState} from "react";
import {VehicleMaintenanceRecordsContext} from "./vehicleMaintenanceRecordsContext";
import {calculateTotals} from "../instructor/vehicle-maintenance/utils";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {monthOptions} from "@/app/utils/utils";

export const VehicleMaintenanceProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const {instructorId} =
        useContext(InstructorIdContext);

    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalGas, setTotalGas] = useState<number>(0);
    const [totalMaintenance, setTotalMaintenance] = useState<number>(0);

    useEffect(() => {
        const fetchData = () => {
            fetch(`/api/${instructorId}/vehicle-maintenance/${selectedMonth}/${selectedYear}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    setRecords(data.records);
                    const totals = calculateTotals(data.records);
                    setTotalGas(totals.totalGas);
                    setTotalMaintenance(totals.totalMaintenance);
                })
                .catch(error => {
                    console.error(error);
                });
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
