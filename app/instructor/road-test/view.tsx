"use client";
import { useContext, useState } from "react";
import DeleteModal from "@/app/components/deleteModal";
import Edit from "./edit";
import { RoadTestRecordsContext } from "@/app/context/roadTestRecordsContext";
import { RoadTestRecordsForUpdate } from "@/app/types/shared/records";
import { DataTable } from "@/app/components/barebone-data-table";
import { columns } from "@/app/instructor/road-test/columns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/app/components/ui/select";
import { monthOptions } from "@/app/utils/utils";

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const contextValue = useContext(RoadTestRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }

    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    const {
        records,
        setRecords,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
    } = contextValue;

    const handleDelete = (id: number | undefined, endpoint: string) => {
        if (id !== undefined) {
            setDeleteRecord({ id, endpoint });
            setDeleteModalOpen(true);
        } else {
            console.warn("Attempted to delete a record without a valid id.");
        }
    };

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                (record) => record.id !== deleteRecord.id,
            );
            setRecords(newRecords);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number | undefined) => {
        setEditRecordId(id ?? null);
        setEditModalOpen(true);
    };

    const handleEditSave = (
        id: number,
        updatedRecord: RoadTestRecordsForUpdate,
    ) => {
        const updatedRecords = records.map((record) =>
            record.id === id ? { ...record, ...updatedRecord } : record,
        );
        setRecords(updatedRecords);
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const tableColumns = columns(handleEdit, handleDelete);
    const editRecord = records.find((r) => r.id === editRecordId);
    const processedRecords = records.map((record) => ({
        ...record,
        name: `${record.student.firstName} ${record.student.lastName}`,
    }));

    return (
        <>
            <div className={"pt-10"}>
                {/* Dropdowns Start */}
                <div className={"flex pb-4 flex-1 sm:flex-0"}>
                    <Select onValueChange={(value) => setSelectedMonth(value)}>
                        <SelectTrigger className="sm:w-[184px]">
                            {monthOptions.find(
                                (monthOption) => monthOption.value === selectedMonth,
                            )?.label || "Month"}
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map((monthOption, index) => (
                                <SelectItem key={index} value={monthOption.value}>
                                    {monthOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setSelectedYear(value)}>
                        <SelectTrigger className="sm:w-[184px] ml-4">
                            {selectedYear || "Year"}
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((yearOption, index) => (
                                <SelectItem key={index} value={yearOption.toString()}>
                                    {yearOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Dropdowns End */}
                <DataTable columns={tableColumns} data={processedRecords} />
            </div>
            {/* Edit Modal */}
            {isEditModalOpen && editRecord && (
                <Edit
                    record={editRecord}
                    onEditSave={handleEditSave}
                    onCancel={handleEditCancel}
                />
            )}
            {/* Delete Modal */}
            {isDeleteModalOpen && deleteRecord && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setDeleteModalOpen(false)}
                    onDeleteConfirm={handleDeleteConfirmed}
                    id={deleteRecord.id}
                    endpoint={deleteRecord.endpoint}
                />
            )}
        </>
    );
}
