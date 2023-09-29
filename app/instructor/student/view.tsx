"use client";
import {useContext, useEffect, useState} from "react";
import DeleteModal from "@/app/components/deleteModal";
import Edit from "./edit";
import {StudentRecordsContext} from "../../context/studentRecordsContext";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {StudentRecordsForUpdate} from "@/app/types/shared/records";
import {StudentFormValues} from "@/app/types/shared/forms";
import {DataTable} from "@/app/components/data-table"
import {columns} from "@/app/instructor/student/columns";
import ErrorNotification from "@/app/components/errorNotification";

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const {instructorId} = useContext(InstructorIdContext);
    const contextValue = useContext(StudentRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {records, setRecords} = contextValue;
    const [tableRecords, setTableRecords] = useState<StudentFormValues[]>([]);

    useEffect(() => {
        const data = records.map(record => record.student);
        setTableRecords(data);
    }, [records]);

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
                (record) => record.student.id !== deleteRecord.id
            );
            setRecords(newRecords);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number | undefined) => {
        setEditRecordId(id ?? null);
        setEditModalOpen(true);
    };

    const handleEditSave = (id: number, updatedRecord: StudentRecordsForUpdate) => {
        const updatedRecords = records.map((record) =>
            record.id === id
                ? {
                    ...record,
                    student: {...record.student, ...updatedRecord},
                }
                : record
        );
        setRecords(updatedRecords);
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditRecordId(null);
    };

    const showErrorMessage = () => {
        setShowDeleteErrorMessage(true);
        setTimeout(() => {
            setShowDeleteErrorMessage(false);
        }, 3000);
    };


    const tableColumns = columns(handleEdit, handleDelete, instructorId);
    const editRecord = records.find((r) => r.student.id === editRecordId);

    return (
        <>
            <div className="py-10">
                <DataTable columns={tableColumns} data={tableRecords} getColumnName="firstName"/>
            </div>
            <ErrorNotification
                show={showDeleteErrorMessage}
                text={"Cannot delete student. Associated lessons exist."}
                onClose={() => setShowDeleteErrorMessage(false)}
            />
            {isEditModalOpen && editRecord && (
                <Edit
                    record={editRecord}
                    onEditSave={handleEditSave}
                    onCancel={handleEditCancel}
                />
            )}
            {isDeleteModalOpen && deleteRecord && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    showDeleteErrorMessage={showErrorMessage}
                    onCancel={() => setDeleteModalOpen(false)}
                    onDeleteConfirm={handleDeleteConfirmed}
                    id={deleteRecord.id}
                    endpoint={deleteRecord.endpoint}
                />
            )}
        </>
    );
}
