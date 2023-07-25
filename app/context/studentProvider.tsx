"use client";
import { useState, useEffect, useContext } from "react";
import { StudentRecordsContext } from "./studentRecordsContext";
import {
    InstructorIdContext,
    InstructorIdContextType,
} from "../instructor/layout";

// @ts-ignore
export const StudentProvider = ({ children }) => {
    const [records, setRecords] = useState([]);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/student`)
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            })
            .catch((err) => console.log(err));
    }, [instructorId]);

    const context = {
        records,
        setRecords,
    };

    return (
        <StudentRecordsContext.Provider value={context}>
            {children}
        </StudentRecordsContext.Provider>
    );
};
