"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import KebabMenu from "../../components/kebabMenu";
import DeleteModal from "../../components/deleteModal";
import Edit from "./edit";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "./utils";

type SetStringAction = Dispatch<SetStateAction<string>>;
type SetNumberAction = Dispatch<SetStateAction<number>>;
type SetLessonArrayAction = Dispatch<
    SetStateAction<LessonWithFormattedDuration[]>
>;

type Student = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    drivingClass: string;
    bde: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    remarks: string;
};

type Lesson = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    paymentType: string;
    paymentAmount: number;
    roadTest: string;
    remarks: string;
    student: Student;
};

type LessonWithFormattedDuration = Lesson & {
    formattedDuration: string;
};

export default function View() {
    const [records, setRecords] = useState<LessonWithFormattedDuration[]>([]);
    const [totalDuration, setTotalDuration] = useState("");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);

    // Define this function outside of your component.
    const fetchRecords = (
        setRecords: SetLessonArrayAction,
        setTotalDuration: SetStringAction,
        setTotalCash: SetNumberAction,
        setTotalInterac: SetNumberAction
    ) => {
        fetch("/api/1/lesson")
            .then((res) => res.json())
            .then((data) => {
                const formattedRecords = data.records.map((record: Lesson) => ({
                    ...record,
                    formattedDuration: formatDuration(Number(record.duration)),
                }));
                setRecords(formattedRecords);
                const total = calculateTotalDuration(data.records);
                setTotalDuration(total);
                setTotalCash(calculateTotalPayment(data.records, "Cash"));
                setTotalInterac(calculateTotalPayment(data.records, "Interac"));
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchRecords(
            setRecords,
            setTotalDuration,
            setTotalCash,
            setTotalInterac
        );
    }, []);

    const handleDelete = (id: number, endpoint: string) => {
        setDeleteRecord({ id, endpoint });
        setDeleteModalOpen(true);
    };

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

    const handleEdit = (id: number) => {
        setEditRecordId(id);
    };

    const handleEditSave = () => {
        fetchRecords(
            setRecords,
            setTotalDuration,
            setTotalCash,
            setTotalInterac
        );
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditRecordId(null);
    };

    return (
        <>
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
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Start Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            End Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Duration
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            {editRecordId === null
                                                ? "Cash Payment"
                                                : "Payment Type"}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            {editRecordId === null
                                                ? "Interac Payment"
                                                : "Payment Amount"}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Road Test
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
                                    {records.map((record, index) => (
                                        <tr
                                            key={index}
                                            className="even:bg-gray-50"
                                        >
                                            {editRecordId === record.id ? (
                                                <Edit
                                                    record={record}
                                                    index={index}
                                                    onEditSave={handleEditSave}
                                                    onCancel={handleEditCancel}
                                                />
                                            ) : (
                                                <>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            record.student
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            record.student
                                                                .lastName
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.startTime}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.endTime}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            record.formattedDuration
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.paymentType ===
                                                        "Cash"
                                                            ? record.paymentAmount.toString()
                                                            : ""}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.paymentType ===
                                                        "Interac"
                                                            ? record.paymentAmount.toString()
                                                            : ""}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.roadTest}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.student.bde}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {record.remarks}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                        <KebabMenu
                                                            onDelete={() =>
                                                                handleDelete(
                                                                    record.id,
                                                                    "/api/1/lesson"
                                                                )
                                                            }
                                                            onEdit={() =>
                                                                handleEdit(
                                                                    record.id
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={11}
                                            className="hidden pr-3 pt-6 text-right text-sm font-bold text-gray-500 sm:table-cell sm:pl-0"
                                        >
                                            Total Hours
                                        </th>
                                        <th
                                            scope="row"
                                            className="pr-3 pt-6 text-left text-sm font-bold text-gray-500 sm:hidden "
                                        >
                                            Total Hours
                                        </th>
                                        <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                                            {totalDuration}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={11}
                                            className="hidden pr-3 pt-4 text-right text-sm font-bold text-gray-500 sm:table-cell sm:pl-0"
                                        >
                                            Total Interac
                                        </th>
                                        <th
                                            scope="row"
                                            className="pr-3 pt-4 text-left text-sm font-bold text-gray-500 sm:hidden"
                                        >
                                            Total Interac
                                        </th>
                                        <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                                            ${totalInterac}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th
                                            scope="row"
                                            colSpan={11}
                                            className="hidden pr-3 pt-4 text-right text-sm font-bold text-gray-500 sm:table-cell sm:pl-0"
                                        >
                                            Total Cash
                                        </th>
                                        <th
                                            scope="row"
                                            className="pr-3 pt-4 text-left text-sm font-bold text-gray-500 sm:hidden"
                                        >
                                            Total Cash
                                        </th>
                                        <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                                            ${totalCash}
                                        </td>
                                    </tr>
                                </tfoot>
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
        </>
    );
}
