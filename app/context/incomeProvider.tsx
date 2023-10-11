"use client";
import {ReactNode, useEffect, useState} from "react";
import {IncomeRecordsContext} from "./incomeRecordsContext";
import {calculateTotals} from "@/app/instructor/income/utils";
import {monthOptions} from "@/app/utils/utils";

export const IncomeProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalIncome, setTotalIncome] = useState<number>(0);

    useEffect(() => {
        const fetchData = () => {
            const params = new URLSearchParams({month: selectedMonth, year: selectedYear.toString()});
            fetch(`/api/instructor/income?${params.toString()}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    setRecords(data.records);
                    const totals = calculateTotals(data.records);
                    setTotalIncome(totals);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        fetchData();
    }, [selectedMonth, selectedYear]);

    const context = {
        records,
        setRecords,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        totalIncome,
        setTotalIncome,
    };

    return (
        <IncomeRecordsContext.Provider value={context}>
            {children}
        </IncomeRecordsContext.Provider>
    );
};
