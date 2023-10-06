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
import {VehicleMaintenanceFormValues} from "@/app/types/shared/forms";

export const columns = (
    handleEdit: (id: number | undefined) => void,
    handleDelete: (id: number | undefined, endpoint: string) => void,
): ColumnDef<VehicleMaintenanceFormValues>[] => [
    {
        header: "#",
        cell: (context) => context.row.index + 1,
    }, {
        accessorKey: "date",
        header: "Date",
    }, {
        accessorKey: "odometer",
        header: "Odometer",
    }, {
        accessorKey: "fueling",
        header: "Fueling",
    }, {
        accessorKey: "gas",
        header: "Gas",
        cell: (context) => {
            const data = context.row.original;
            return "$" + data.gas;
        }
    }, {
        accessorKey: "maintenance",
        header: "Maintenance",
        cell: (context) => {
            const data = context.row.original;
            return "$" + data.maintenance;
        }
    }, {
        accessorKey: "remarks",
        header: "Remarks",
    }, {
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
                            onClick={() => handleDelete(record.id, `/api/instructor/vehicle-maintenance`)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
