"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { IncomeFormValues } from "@/app/types/shared/forms";

export const columns = (
    handleEdit: (id: number | undefined) => void,
    handleDelete: (id: number | undefined, endpoint: string) => void,
): ColumnDef<IncomeFormValues>[] => [
        {
            header: "#",
            cell: (context) => context.row.index + 1,
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "income",
            header: "Income",
            cell: (context) => {
                const data = context.row.original;
                return "$" + data.income;
            },
        },
        {
            accessorKey: "incomeMethod",
            header: "Income Method",
        },
        {
            accessorKey: "remarks",
            header: "Remarks",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const record = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(record.id)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(record.id, `/api/instructor/income`)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
