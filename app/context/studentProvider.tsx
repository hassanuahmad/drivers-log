"use client";
import {ReactNode, useContext, useEffect, useState} from "react";
import {StudentRecordsContext} from "./studentRecordsContext";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

export const StudentProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);
    const {instructorId} =
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
