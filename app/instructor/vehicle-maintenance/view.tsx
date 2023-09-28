"use client";
import {useContext, useState} from "react";
import DeleteModal from "@/app/components/deleteModal";
import Edit from "./edit";
import {calculateTotals} from "./utils";
import {VehicleMaintenanceRecordsContext} from "../../context/vehicleMaintenanceRecordsContext";
import {VehicleMaintenanceRecordForUpdate} from "@/app/types/shared/records";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/app/components/ui/select";
import {DataTable} from "@/app/instructor/vehicle-maintenance/vm-data-table";
import {columns} from "@/app/instructor/vehicle-maintenance/columns";

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const {instructorId} = useContext(InstructorIdContext);

    const contextValue = useContext(VehicleMaintenanceRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {
        records,
        setRecords,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        totalGas,
        setTotalGas,
        totalMaintenance,
        setTotalMaintenance,
    } = contextValue;

    const monthOptions = [
        {label: "January", value: "01"},
        {label: "February", value: "02"},
        {label: "March", value: "03"},
        {label: "April", value: "04"},
        {label: "May", value: "05"},
        {label: "June", value: "06"},
        {label: "July", value: "07"},
        {label: "August", value: "08"},
        {label: "September", value: "09"},
        {label: "October", value: "10"},
        {label: "November", value: "11"},
        {label: "December", value: "12"},
    ];

    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    const handleDelete = (id: number | undefined, endpoint: string) => {
        if (id !== undefined) {
            setDeleteRecord({id, endpoint});
            setDeleteModalOpen(true);
        } else {
            console.warn("Attempted to delete a record without a valid id.");
        }
    };

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                (record) => record.id !== deleteRecord.id
            );
            setRecords(newRecords);
            const totals = calculateTotals(newRecords);
            setTotalGas(totals.totalGas);
            setTotalMaintenance(totals.totalMaintenance);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number | undefined) => {
        setEditRecordId(id ?? null);
        setEditModalOpen(true);
    };

    const handleEditSave = (id: number, updatedRecord: VehicleMaintenanceRecordForUpdate) => {
        const updatedRecords = records.map((record) =>
            record.id === id ? {...record, ...updatedRecord} : record
        );
        setRecords(updatedRecords);
        const totals = calculateTotals(updatedRecords);
        setTotalGas(totals.totalGas);
        setTotalMaintenance(totals.totalMaintenance);
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const tableColumns = columns(handleEdit, handleDelete, instructorId);
    const editRecord = records.find((r) => r.id === editRecordId);

    return (
        <>
            <div className={"pt-10"}>
                {/* Dropdowns Start */}
                <div className={"flex items-center"}>
                    <div className={"flex pb-4"}>
                        <Select onValueChange={(value) => setSelectedMonth(value)}>
                            <SelectTrigger className="w-[180px]">
                                {
                                    monthOptions.find(
                                        (monthOption) => monthOption.value === selectedMonth
                                    )?.label || "Month"
                                }
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((monthOption, index) => (
                                    <SelectItem key={index} value={monthOption.value}>
                                        {monthOption.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className={"ml-6"}>
                            <Select onValueChange={(value) => setSelectedYear(value)}>
                                <SelectTrigger className="w-[180px]">
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
                    </div>
                </div>
                {/* Dropdowns End */}
                <DataTable columns={tableColumns} data={records}/>
            </div>

            {/* Lesson Stats */}
            <div className="flex justify-end py-6">
                <div className="flex flex-col">
                            <span className="text-right text-sm font-bold text-gray-500">
                                Gas:
                            </span>
                    <span className="text-right text-sm font-bold text-gray-500 pt-4">
                                Maintenance:
                             </span>
                </div>
                <div className="flex flex-col ml-3">
                            <span className="text-sm text-gray-500 text-right">
                                ${totalGas}
                            </span>
                    <span className="text-sm text-gray-500 pt-4 text-right">
                            ${totalMaintenance}
                        </span>
                </div>
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
};
