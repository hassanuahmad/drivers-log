"use client";
import { ReactNode, useEffect, useState } from "react";
import { RoadTestRecordsContext } from "./roadTestRecordsContext";
import { StudentRecords } from "@/app/types/shared/records";
import { monthOptions } from "@/app/utils/utils";

export const RoadTestProvider = ({ children }: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value,
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const params = new URLSearchParams({
            month: selectedMonth,
            year: selectedYear.toString(),
        });
        fetch(`/api/instructor/road-test?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            })
            .catch((err) => console.log(err));
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetch(`/api/instructor/student`)
            .then((res) => res.json())
            .then((data) => {
                // sort the students alphabetically by first name
                const sortedRecords = data.records.sort(
                    (a: StudentRecords, b: StudentRecords) =>
                        a.student.firstName.localeCompare(b.student.firstName),
                );
                setStudentRecords(sortedRecords);
            })
            .catch((err) => console.log(err));
    }, []);

    const context = {
        records,
        setRecords,
        studentRecords,
        setStudentRecords,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
    };

    return (
        <RoadTestRecordsContext.Provider value={context}>
            {children}
        </RoadTestRecordsContext.Provider>
    );
};
