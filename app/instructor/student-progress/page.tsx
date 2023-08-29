"use client";
import { useContext, useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import { LessonRecordsContext } from "../../context/lessonRecordsContext";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "./utils";
import RemarksModal from "../../components/remarksModal";
import { Combobox } from "@headlessui/react";

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
    const [query, setQuery] = useState("");

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

    const filteredPeople =
        query === ""
            ? studentRecords
            : // @ts-ignore
              studentRecords.filter((record) => {
                  return record.student.firstName
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    return (
        <>
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                        <h3 className="text-xl font-semibold leading-6 text-gray-900">
                            {selectedStudent
                                ? // @ts-ignore
                                  selectedStudent.student.firstName +
                                  " " +
                                  // @ts-ignore
                                  selectedStudent.student.lastName +
                                  "'s Progress"
                                : "Student Progress"}
                        </h3>
                    </div>
                    <div className="ml-4 mt-2 flex-shrink-0">
                        <Combobox
                            as="div"
                            className="sm:col-span-1"
                            value={
                                // @ts-ignore
                                selectedStudent?.student.id || ""
                            }
                            onChange={(selectedId) => {
                                const matchedRecord = studentRecords.find(
                                    // @ts-ignore
                                    (record) => record.student.id === selectedId
                                );
                                if (matchedRecord) {
                                    setSelectedStudent(matchedRecord);
                                }
                            }}
                        >
                            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                                Select Student
                            </Combobox.Label>
                            <div className="relative mt-2">
                                <Combobox.Input
                                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    displayValue={() => {
                                        return selectedStudent
                                            ? // @ts-ignore
                                              `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`
                                            : "";
                                    }}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>

                                {filteredPeople.length > 0 && (
                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {/* @ts-ignore */}
                                        {filteredPeople.map((record) => (
                                            <Combobox.Option
                                                key={record.student.id}
                                                value={record.student.id}
                                                className={({ active }) =>
                                                    classNames(
                                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                                        active
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-gray-900"
                                                    )
                                                }
                                                onSelect={() =>
                                                    setSelectedStudent(record)
                                                }
                                            >
                                                {({ active, selected }) => (
                                                    <>
                                                        <span
                                                            className={classNames(
                                                                "block truncate",
                                                                selected &&
                                                                    "font-semibold"
                                                            )}
                                                        >
                                                            {
                                                                record.student
                                                                    .firstName
                                                            }{" "}
                                                            {
                                                                record.student
                                                                    .lastName
                                                            }
                                                        </span>

                                                        {selected && (
                                                            <span
                                                                className={classNames(
                                                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                                                    active
                                                                        ? "text-white"
                                                                        : "text-indigo-600"
                                                                )}
                                                            >
                                                                <CheckIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Options>
                                )}
                            </div>
                        </Combobox>
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
