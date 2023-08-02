"use client";
import { useState, useEffect, useContext } from "react";
import { LessonRecordsContext } from "./lessonRecordsContext";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "../instructor/lesson/utils";
import {
    InstructorIdContext,
    InstructorIdContextType,
} from "../instructor/layout";

// @ts-ignore
export const LessonProvider = ({ children }) => {
    const [records, setRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);

    const monthOptions = [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "Oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" },
    ];

    const [selectedMonth, setSelectedMonth] = useState(
        monthOptions[new Date().getMonth()].value
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalDuration, setTotalDuration] = useState("");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/lesson/${selectedMonth}/${selectedYear}`)
            .then((res) => res.json())
            .then((data) => {
                // @ts-ignore
                const formattedRecords = data.records.map((record) => ({
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
    }, [instructorId, selectedMonth, selectedYear]);

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/student`)
            .then((res) => res.json())
            .then((data) => {
                // sort the students alphabetically by first name
                // @ts-ignore
                const sortedRecords = data.records.sort((a, b) =>
                    a.student.firstName.localeCompare(b.student.firstName)
                );
                setStudentRecords(sortedRecords);
            })
            .catch((err) => console.log(err));
    }, [instructorId]);

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
