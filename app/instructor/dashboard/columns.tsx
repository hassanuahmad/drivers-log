"use client"

import {ColumnDef} from "@tanstack/react-table"
import {LessonRecordsPreFormattedDuration} from "@/app/types/shared/records";
import {formatDuration} from "@/app/utils/utils";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";

export const columns = (): ColumnDef<LessonRecordsPreFormattedDuration>[] => [
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
        accessorKey: "duration",
        header: "Duration",
        cell: (context) => {
            const data = context.row.original;
            return formatDuration(data.duration);
        }
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
        id: "actions",
        cell: () => {
            return (
                <Link href="/instructor/lesson">
                    <Button variant={"link"}>View More</Button>
                </Link>
            )
        }
    },
]
