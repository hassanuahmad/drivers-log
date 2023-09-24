"use client";
import {useContext, useState} from "react";
import KebabMenu from "../../components/kebabMenu";
import DeleteModal from "../../components/deleteModal";
import Edit from "./edit";
import {StudentRecordsContext} from "../../context/studentRecordsContext";
import {contains} from "@/app/utils/contains";
import RemarksModal from "../../components/remarksModal";
import {StudentRecordsForUpdate} from "@/app/types/shared/records";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [searchName, setSearchName] = useState<string>("");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const {instructorId} =
        useContext(InstructorIdContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const contextValue = useContext(StudentRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {records, setRecords} = contextValue;

    const handleDelete = (id: number, endpoint: string) => {
        setDeleteRecord({id, endpoint});
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                (record) => record.student.id !== deleteRecord.id
            );
            setRecords(newRecords);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (id: number) => {
        setEditRecordId(id);
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
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditRecordId(null);
    };

    return (
        <>
            <div>
                <label
                    htmlFor="search"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    Quick search
                </label>
                <div className="relative w-full sm:w-6/12 lg:w-1/4 mt-2 flex items-center">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                        <kbd
                            className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                            ⌘K
                        </kbd>
                    </div>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle ">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                    >
                                        #
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        First Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Last Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Phone Number
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Class
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        BDE
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Remarks
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                                    ></th>
                                </tr>
                                </thead>
                                <tbody className="bg-white">
                                {records.map((record, index) => {
                                    if (
                                        contains(
                                            [
                                                record.student.firstName,
                                                record.student.lastName,
                                            ],
                                            searchName
                                        )
                                    )
                                        return (
                                            <tr
                                                key={index}
                                                className="even:bg-gray-50"
                                            >
                                                {editRecordId ===
                                                record.student.id ? (
                                                    <Edit
                                                        record={record}
                                                        index={index}
                                                        onEditSave={
                                                            handleEditSave
                                                        }
                                                        onCancel={
                                                            handleEditCancel
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .firstName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .lastName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .phoneNumber
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .email
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .streetAddress
                                                            }{" "}
                                                            {
                                                                record
                                                                    .student
                                                                    .city
                                                            }{" "}
                                                            {
                                                                record
                                                                    .student
                                                                    .province
                                                            }{" "}
                                                            {
                                                                record
                                                                    .student
                                                                    .postalCode
                                                            }{" "}
                                                            {
                                                                record
                                                                    .student
                                                                    .country
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .drivingClass
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record
                                                                    .student
                                                                    .bde
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[20rem] overflow-ellipsis overflow-hidden">
                                                            {record.student
                                                                .remarks
                                                                .length >
                                                            25 ? (
                                                                <>
                                                                    {record.student.remarks.substring(
                                                                        0,
                                                                        25
                                                                    )}
                                                                    ...{" "}
                                                                    <button
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                        onClick={() => {
                                                                            setModalContent(
                                                                                record
                                                                                    .student
                                                                                    .remarks
                                                                            );
                                                                            setIsModalOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        View
                                                                        More
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                record
                                                                    .student
                                                                    .remarks
                                                            )}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                                                            <KebabMenu
                                                                onDelete={() => {
                                                                    if (record.student.id !== undefined) {
                                                                        handleDelete(record.student.id, `/api/${instructorId}/student`);
                                                                    }
                                                                }}
                                                                onEdit={() => {
                                                                    if (record.student.id !== undefined) {
                                                                        handleEdit(record.student.id);
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete Modal */}
            {deleteRecord && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onCancel={() => setDeleteModalOpen(false)}
                    onDeleteConfirm={handleDeleteConfirmed}
                    id={deleteRecord.id}
                    endpoint={deleteRecord.endpoint}
                />
            )}
            {/* Remarks Modal */}
            {isModalOpen && (
                <RemarksModal
                    open={isModalOpen}
                    setOpen={setIsModalOpen}
                    modalContent={modalContent}
                />
            )}
        </>
    );
}
