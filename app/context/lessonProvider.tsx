"use client";
import {ReactNode, useEffect, useState} from "react";
import {LessonRecordsContext} from "./lessonRecordsContext";
import {calculateTotalDuration, calculateTotalPayment, formatDuration, monthOptions} from "@/app/utils/utils";
import {LessonRecordsPreFormattedDuration, StudentRecords} from "@/app/types/shared/records";

export const LessonProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalDuration, setTotalDuration] = useState("");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams({month: selectedMonth, year: selectedYear.toString()});
        fetch(`/api/instructor/lesson?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const formattedRecords = data.records.map((record: LessonRecordsPreFormattedDuration) => ({
                    ...record,
                    formattedDuration: formatDuration(Number(record.duration)),
                }));
                setRecords(formattedRecords);
                const total = calculateTotalDuration(data.records);
                setTotalDuration(total);
                setTotalCash(calculateTotalPayment(data.records, "Cash"));
                setTotalInterac(calculateTotalPayment(data.records, "Interac"));
            })
            .catch((err) => console.log(err));
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetch(`/api/instructor/student`)
            .then((res) => res.json())
            .then((data) => {
                // sort the students alphabetically by first name
                const sortedRecords = data.records.sort((a: StudentRecords, b: StudentRecords) =>
                    a.student.firstName.localeCompare(b.student.firstName)
                );
                setStudentRecords(sortedRecords);
            })
            .catch((err) => console.log(err));
    }, []);

    const context = {
        studentRecords,
        setStudentRecords,
        records,
        setRecords,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        totalDuration,
        setTotalDuration,
        totalCash,
        setTotalCash,
        totalInterac,
        setTotalInterac,
    };

    return (
        <LessonRecordsContext.Provider value={context}>
            {children}
        </LessonRecordsContext.Provider>
    );
};
