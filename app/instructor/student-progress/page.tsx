"use client";
import {useContext, useEffect, useState} from "react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {LessonRecordsContext} from "../../context/lessonRecordsContext";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {calculateTotalDuration, calculateTotalPayment, formatDuration, generateDoc,} from "./utils";
import RemarksModal from "../../components/remarksModal";
import {Combobox} from "@headlessui/react";
import {LessonRecords, LessonRecordsPreFormattedDuration, StudentRecords} from "@/app/types/shared/records";

function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Page() {
    const contextValue = useContext(LessonRecordsContext);
    if (!contextValue) {
        // Handle the null context appropriately, maybe return null or some fallback UI
        return null;
    }
    const {studentRecords} = contextValue;
    const [selectedStudent, setSelectedStudent] = useState<StudentRecords | null>(null);
    const {instructorId} =
        useContext(InstructorIdContext);
    const [records, setRecords] = useState<LessonRecords[]>([]);
    const [totalDuration, setTotalDuration] = useState("0hr 0min");
    const [totalCash, setTotalCash] = useState(0);
    const [totalInterac, setTotalInterac] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!instructorId || !selectedStudent) return;
        fetch(
            `/api/${instructorId}/student-progress/${selectedStudent.student.id}`
        )
            .then((res) => res.json())
            .then((data) => {
                const formattedRecords = data.records.map((record: LessonRecordsPreFormattedDuration) => ({
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
            :
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
                                ?
                                selectedStudent.student.firstName +
                                " " +
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
                                selectedStudent?.student.id || ""
                            }
                            onChange={(selectedId) => {
                                const matchedRecord = studentRecords.find(
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
                                            ?
                                            `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`
                                            : "";
                                    }}
                                />
                                <Combobox.Button
                                    className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>

                                {filteredPeople.length > 0 && (
                                    <Combobox.Options
                                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredPeople.map((record) => (
                                            <Combobox.Option
                                                key={record.student.id}
                                                value={record.student.id}
                                                className={({active}) =>
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
                                                {({active, selected}) => (
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
                                                        ?
                                                        `$${record.paymentAmount.toString()}`
                                                        : ""}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {record.paymentType ===
                                                    "Interac"
                                                        ?
                                                        `$${record.paymentAmount.toString()}`
                                                        : ""}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {record.roadTest}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {record.student.bde}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[20rem] overflow-ellipsis overflow-hidden">
                                                    {record.remarks.length >
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
                                                                View More
                                                            </button>
                                                        </>
                                                    ) : (
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
            {/* !!! THIS IS ONLY FOR MY FATHER CURRENTLY !!! */}
            {instructorId === 14 ? (
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={async () => {
                            try {
                                await generateDoc(records, instructorId);
                            } catch (error) {
                                console.error(
                                    "Failed to generate document:",
                                    error
                                );
                            }
                        }}
                    >
                        Download BDE Report
                    </button>
                </div>
            ) : (
                ""
            )}
        </>
    );
}
