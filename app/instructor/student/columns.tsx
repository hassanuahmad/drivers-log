"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {StudentFormValues} from "@/app/types/shared/forms";

export const columns = (
    handleEdit: (id: number | undefined) => void,
    handleDelete: (id: number | undefined, endpoint: string) => void,
    instructorId: number | null,
): ColumnDef<StudentFormValues>[] => [
    {
        header: "#",
        cell: (context) => context.row.index + 1,
    }, {
        accessorKey: "firstName",
        header: "First Name",
    }, {
        accessorKey: "lastName",
        header: "Last Name",
    }, {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    }, {
        accessorKey: "email",
        header: "Email",
    }, {
        accessorKey: "address",
        header: "Address",
        cell: (context) => {
            const data = context.row.original;
            return `${data.streetAddress} ${data.city} ${data.province} ${data.postalCode} ${data.country}`;
        }
    }, {
        accessorKey: "drivingClass",
        header: "Class",
    }, {
        accessorKey: "bde",
        header: "BDE",
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
                            onClick={() => handleDelete(record.id, `/api/${instructorId}/student`)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
