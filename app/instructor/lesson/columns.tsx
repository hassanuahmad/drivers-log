"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"
import {Button} from '@/app/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {LessonRecords} from "@/app/types/shared/records";

export const columns = (
    handleEdit: (id: number | undefined) => void,
    handleDelete: (id: number | undefined, endpoint: string) => void,
): ColumnDef<LessonRecords>[] => [
    {
        header: "#",
        cell: (context) => context.row.index + 1,
    }, {
        accessorKey: "name",
        header: "Name",
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
    {
        id: "actions",
        cell: ({row}) => {
            const record = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(record.id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(record.id, `/api/instructor/lesson`)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
