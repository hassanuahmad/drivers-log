"use client"

import {ColumnDef} from "@tanstack/react-table"
import {LessonRecords} from "@/app/types/shared/records";

export const columns = (): ColumnDef<LessonRecords>[] => [
    {
        header: "#",
        cell: (context) => context.row.index + 1,
    }, {
        accessorKey: "name",
        header: "Name",
        cell: (context) => {
            const data = context.row.original.student;
            return data.firstName + " " + data.lastName;
        }
    }, {
        accessorKey: "date",
        header: "Date",
    }, {
        accessorKey: "startTime",
        header: "Start Time",
    }, {
        accessorKey: "endTime",
        header: "End Time",
    }, {
        accessorKey: "formattedDuration",
        header: "Duration",
    }, {
        accessorKey: "cashAmount",
        header: "Cash Payment",
        cell: (context) => {
            const data = context.row.original;
            if (data.paymentType === "Cash") {
                return "$" + data.paymentAmount;
            } else {
                return "";
            }
        }
    }, {
        accessorKey: "interacAmount",
        header: "Interac Payment",
        cell: (context) => {
            const data = context.row.original;
            if (data.paymentType === "Interac") {
                return "$" + data.paymentAmount;
            } else {
                return "";
            }
        }
    }, {
        accessorKey: "roadTest",
        header: "Road Test",
    }, {
        accessorKey: "bde",
        header: "BDE",
        cell: (context) => {
            const data = context.row.original.student;
            return data.bde;
        }
    }, {
        accessorKey: "remarks",
        header: "Remarks",
    },
]
