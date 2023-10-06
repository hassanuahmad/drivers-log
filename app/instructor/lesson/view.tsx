"use client";
import {useCallback, useContext, useEffect, useState} from "react";
import DeleteModal from "@/app/components/deleteModal";
import Edit from "./edit";
import {debounce, downloadCSV, isEqual} from "./utils";
import {calculateTotalDuration, calculateTotalPayment, formatDuration, monthOptions} from "@/app/utils/utils";
import {LessonRecordsContext} from "../../context/lessonRecordsContext";
import {LessonRecords, LessonRecordsForUpdate} from "@/app/types/shared/records";
import {DataTable} from "@/app/components/data-table";
import {columns} from "@/app/instructor/lesson/columns";
import {Button} from "@/app/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger,} from "@/app/components/ui/select"

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const contextValue = useContext(LessonRecordsContext);
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
        totalDuration,
        setTotalDuration,
        totalCash,
        setTotalCash,
        totalInterac,
        setTotalInterac,
    } = contextValue;

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
    }

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                (record) => record.id !== deleteRecord.id
            );
            setRecords(newRecords);
            const total = calculateTotalDuration(newRecords);
            setTotalDuration(total);
            setTotalCash(calculateTotalPayment(newRecords, "Cash"));
            setTotalInterac(calculateTotalPayment(newRecords, "Interac"));
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number | undefined) => {
        setEditRecordId(id ?? null);
        setEditModalOpen(true);
    };

    const handleEditSave = (id: number, updatedRecord: LessonRecordsForUpdate) => {
        const updatedRecords = records.map((record) => {
            if (record.id === id) {
                // Parse the startTime and endTime strings to Date objects
                const start = new Date(
                    `1970-01-01T${updatedRecord.startTime}:00`
                ); // Adding ":00" for seconds
                const end = new Date(`1970-01-01T${updatedRecord.endTime}:00`);

                // Calculate the duration in minutes
                const duration = (end.getTime() - start.getTime()) / 60000;

                // Return the updated record with the new duration
                return {
                    ...record,
                    ...updatedRecord,
                    duration,
                    formattedDuration: formatDuration(duration),
                };
            }
            return record;
        });

        updatedRecords.sort((a, b) => {
            // Compare dates
            const dateComparison = a.date.localeCompare(b.date);
            if (dateComparison !== 0) {
                // If dates are different, return the comparison result
                return dateComparison;
            } else {
                // If dates are the same, compare times
                return a.startTime.localeCompare(b.startTime);
            }
        });

        setRecords(updatedRecords);

        const total = calculateTotalDuration(updatedRecords);
        setTotalDuration(total);
        setTotalCash(calculateTotalPayment(updatedRecords, "Cash"));
        setTotalInterac(calculateTotalPayment(updatedRecords, "Interac"));
        setDeleteModalOpen(false);
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const tableColumns = columns(handleEdit, handleDelete);
    const editRecord = records.find((r) => r.id === editRecordId);
    const [filteredRecords, setFilteredRecords] = useState<LessonRecords[]>([]);

    // Debounce the filtered records update to avoid unnecessary re-renders
    const setFilteredRecordsDebounced = debounce(setFilteredRecords, 300);

    const handleFilteredRowsChange = useCallback((newRecords: LessonRecords[]) => {
        // Checking if there's a real change in the data
        if (!isEqual(newRecords, filteredRecords)) {
            setFilteredRecordsDebounced(newRecords);
        }
    }, [filteredRecords, setFilteredRecordsDebounced]);

    useEffect(() => {
        const total = calculateTotalDuration(filteredRecords);
        setTotalDuration(total);
        setTotalCash(calculateTotalPayment(filteredRecords, "Cash"));
        setTotalInterac(calculateTotalPayment(filteredRecords, "Interac"));
    }, [filteredRecords]);

    const processedRecords = records.map(record => ({
        ...record,
        name: `${record.student.firstName} ${record.student.lastName}`
    }));

    return (
        <>
            <div className={"pt-10"}>
                {/* Dropdowns Start */}
                <div className={"flex pb-4 flex-1 sm:flex-0"}>
                    <Select onValueChange={(value) => setSelectedMonth(value)}>
                        <SelectTrigger className="sm:w-[184px]">
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

                <DataTable data={processedRecords} columns={tableColumns} getColumnName="name"
                           onFilteredRowsChange={handleFilteredRowsChange}/>
            </div>
            {/* Lesson Stats */}
            <div className="flex justify-end py-6">
                <div className="flex flex-col">
                    <span className="text-right text-sm font-bold text-gray-500">
                        Total Hours:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500 py-4">
                        Total Interac:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500">
                        Total Cash:
                    </span>
                </div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm text-gray-500 text-right">
                        {totalDuration}
                    </span>
                    <span className="text-sm text-gray-500 py-4 text-right">
                        ${totalInterac}
                    </span>
                    <span className="text-sm text-gray-500 text-right">
                        ${totalCash}
                    </span>
                </div>
            </div>
            <div className="flex justify-end pb-6">
                <Button variant={"outline"} onClick={() =>
                    downloadCSV(
                        records,
                        `${selectedMonth}-${selectedYear}-lessons.csv`
                    )
                }>Download CSV</Button>
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
