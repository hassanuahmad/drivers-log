"use client";
import { useState, useContext, Fragment, useEffect } from "react";
import KebabMenu from "../../components/kebabMenu";
import DeleteModal from "../../components/deleteModal";
import Edit from "./edit";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "./utils";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { LessonRecordsContext } from "../../context/lessonRecordsContext";
import RemarksModal from "../../components/remarksModal";
import { contains } from "@/app/utils/contains";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

export default function View() {
    const [deleteRecord, setDeleteRecord] = useState<{
        id: number;
        endpoint: string;
    } | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editRecordId, setEditRecordId] = useState<number | null>(null);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [searchName, setSearchName] = useState<String>("");

    const {
        // @ts-ignore
        studentRecords,
        // @ts-ignore
        records,
        // @ts-ignore
        setRecords,
        // @ts-ignore
        selectedMonth,
        // @ts-ignore
        setSelectedMonth,
        // @ts-ignore
        selectedYear,
        // @ts-ignore
        setSelectedYear,
        // @ts-ignore
        totalDuration,
        // @ts-ignore
        setTotalDuration,
        // @ts-ignore
        totalCash,
        // @ts-ignore
        setTotalCash,
        // @ts-ignore
        totalInterac,
        // @ts-ignore
        setTotalInterac,
    } = useContext(LessonRecordsContext);

    const [displayedRecords, setDisplayedRecords] = useState(records);

    useEffect(() => {
        // Filter the records based on the search term
        // @ts-ignore
        const filteredRecords = records.filter((record) =>
            contains(
                [record.student.firstName, record.student.lastName],
                // @ts-ignore
                searchName
            )
        );

        // Set the displayed records
        setDisplayedRecords(filteredRecords);

        // Calculate and set the totals
        const total = calculateTotalDuration(filteredRecords);
        setTotalDuration(total);
        setTotalCash(calculateTotalPayment(filteredRecords, "Cash"));
        setTotalInterac(calculateTotalPayment(filteredRecords, "Interac"));
    }, [records, searchName]);

    const monthOptions = [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "Oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" },
    ];

    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    const handleDelete = (id: number, endpoint: string) => {
        setDeleteRecord({ id, endpoint });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = () => {
        if (deleteRecord) {
            const newRecords = records.filter(
                // @ts-ignore
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

    // @ts-ignore
    const handleEditSave = (id: number, updatedRecord) => {
        // @ts-ignore
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

        // @ts-ignore
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
        setEditRecordId(null);
    };

    const handleEditCancel = () => {
        setEditRecordId(null);
    };

    return (
        <>
            {/* Dropdowns Start */}
            <div className="flex justify-between mt-6">
                <div className="relative w-full sm:w-6/12 lg:w-1/4 flex items-center">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Quick Search..."
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                        <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                            ⌘K
                        </kbd>
                    </div>
                </div>
                <div className="flex">
                    <div className="mr-4">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {
                                        monthOptions.find(
                                            (monthOption) =>
                                                monthOption.value ===
                                                selectedMonth
                                        )?.label
                                    }
                                    <ChevronDownIcon
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {monthOptions.map(
                                            (monthOption, index) => (
                                                <Menu.Item key={index}>
                                                    {({ active }) => (
                                                        <a
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700",
                                                                "block px-4 py-2 text-sm"
                                                            )}
                                                            onClick={() =>
                                                                setSelectedMonth(
                                                                    monthOption.value
                                                                )
                                                            }
                                                        >
                                                            {monthOption.label}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            )
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                    <div>
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {selectedYear}
                                    <ChevronDownIcon
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {years.map((yearOption, index) => (
                                            <Menu.Item key={index}>
                                                {({ active }) => (
                                                    <a
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                        onClick={() =>
                                                            setSelectedYear(
                                                                yearOption
                                                            )
                                                        }
                                                    >
                                                        {yearOption}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
            {/* Dropdowns End */}
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
                                    {/* @ts-ignore */}
                                    {displayedRecords.map((record, index) => {
                                        if (
                                            contains(
                                                [
                                                    record.student.firstName,
                                                    record.student.lastName,
                                                ],
                                                // @ts-ignore
                                                searchName
                                            )
                                        )
                                            return (
                                                <tr
                                                    key={index}
                                                    className="even:bg-gray-50"
                                                >
                                                    {editRecordId ===
                                                    record.id ? (
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
                                                                }{" "}
                                                                {
                                                                    record
                                                                        .student
                                                                        .lastName
                                                                }
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {record.date}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {
                                                                    record.startTime
                                                                }
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
                                                                    ? `$${record.paymentAmount.toString()}`
                                                                    : ""}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {record.paymentType ===
                                                                "Interac"
                                                                    ? `$${record.paymentAmount.toString()}`
                                                                    : ""}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {
                                                                    record.roadTest
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
                                                                {record.remarks
                                                                    .length >
                                                                25 ? (
                                                                    <>
                                                                        {record.remarks.substring(
                                                                            0,
                                                                            25
                                                                        )}
                                                                        ...{" "}
                                                                        <button
                                                                            className="text-indigo-600 hover:text-indigo-900"
                                                                            onClick={() => {
                                                                                setModalContent(
                                                                                    record.remarks
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
                                                                    record.remarks
                                                                )}
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-3">
                                                                <KebabMenu
                                                                    onDelete={() =>
                                                                        handleDelete(
                                                                            record.id,
                                                                            `/api/${instructorId}/lesson`
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
                                            );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lesson Stats */}
            <div className="flex justify-end">
                <div className="flex flex-col">
                    <span className="text-right text-sm font-bold text-gray-500 pr-3 pt-6 ">
                        Total Hours:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500 pr-3 pt-4">
                        Total Interac:
                    </span>
                    <span className="text-right text-sm font-bold text-gray-500 pr-3 pt-4 pb-6 ">
                        Total Cash:
                    </span>
                </div>
                <div className="flex flex-col ml-3">
                    <span className="text-sm text-gray-500 pr-3 pt-6 text-right">
                        {totalDuration}
                    </span>
                    <span className="text-sm text-gray-500 pr-3 pt-4 text-right">
                        ${totalInterac}
                    </span>
                    <span className="text-sm text-gray-500 pr-3 pt-4 pb-6 text-right">
                        ${totalCash}
                    </span>
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
