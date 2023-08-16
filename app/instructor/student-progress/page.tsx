"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import { LessonRecordsContext } from "../../context/lessonRecordsContext";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "./utils";
import RemarksModal from "../../components/remarksModal";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Page() {
    // @ts-ignore
    const { studentRecords } = useContext(LessonRecordsContext);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);
    const [records, setRecords] = useState([]);
    const [totalDuration, setTotalDuration] = useState("0hr 0min");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        if (!instructorId || !selectedStudent) return;
        fetch(
            // @ts-ignore
            `/api/${instructorId}/student-progress/${selectedStudent.student.id}`
        )
            .then((res) => res.json())
            .then((data) => {
                // @ts-ignore
                const formattedRecords = data.records.map((record) => ({
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
    }, [instructorId, selectedStudent]);

    return (
        <>
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Student Progress
                        </h3>
                    </div>
                    <div className="ml-4 mt-2 flex-shrink-0">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {selectedStudent
                                        ? // @ts-ignore
                                          selectedStudent.student.firstName +
                                          " " +
                                          // @ts-ignore
                                          selectedStudent.student.lastName
                                        : "Select Student"}
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
                                <Menu.Items className="absolute right-0 w-56 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {/* @ts-ignore */}
                                        {studentRecords.map((info, index) => (
                                            <Menu.Item key={index}>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                        onClick={(e) => {
                                                            setSelectedStudent(
                                                                info
                                                            );
                                                        }}
                                                    >
                                                        {info.student.firstName}{" "}
                                                        {info.student.lastName}
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

            {/* Table */}
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
                                            Cash Payment
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Interac Payment
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
                                    {records.map((record, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="even:bg-gray-50"
                                            >
                                                <>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            // @ts-ignore
                                                            record.student
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            // @ts-ignore
                                                            record.student
                                                                .lastName
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.startTime}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.endTime}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            // @ts-ignore
                                                            record.formattedDuration
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.paymentType ===
                                                        "Cash"
                                                            ? //@ts-ignore
                                                              `$${record.paymentAmount.toString()}`
                                                            : ""}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.paymentType ===
                                                        "Interac"
                                                            ? //@ts-ignore
                                                              `$${record.paymentAmount.toString()}`
                                                            : ""}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.roadTest}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {record.student.bde}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[20rem] overflow-ellipsis overflow-hidden">
                                                        {/* @ts-ignore */}
                                                        {record.remarks.length >
                                                        25 ? (
                                                            <>
                                                                {/* @ts-ignore */}
                                                                {record.remarks.substring(
                                                                    0,
                                                                    25
                                                                )}
                                                                ...{" "}
                                                                <button
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    onClick={() => {
                                                                        setModalContent(
                                                                            // @ts-ignore
                                                                            record.remarks
                                                                        );
                                                                        setIsModalOpen(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    View More
                                                                </button>
                                                            </>
                                                        ) : (
                                                            //@ts-ignore
                                                            record.remarks
                                                        )}
                                                    </td>
                                                </>
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
