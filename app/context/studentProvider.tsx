"use client";
import {ReactNode, useEffect, useState} from "react";
import {StudentRecordsContext} from "./studentRecordsContext";

export const StudentProvider = ({children}: { children: ReactNode }) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetch(`/api/instructor/student`)
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            })
            .catch((err) => console.log(err));
    }, []);

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
