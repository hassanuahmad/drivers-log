// @ts-nocheck
"use client";
import { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../../components/notification";
import {
    formatDuration,
    calculateTotalDuration,
    calculateTotalPayment,
} from "./utils";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import { LessonRecordsContext } from "../../context/lessonRecordsContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

interface LessonFormValues {
    selectStudent: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentType: string;
    paymentAmount: Number;
    roadTest: string;
    remarks: string;
}

const validationSchema = Yup.object({
    selectStudent: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
    paymentType: Yup.string().required("Required"),
    paymentAmount: Yup.number().required("Required"),
    roadTest: Yup.string().required("Required"),
    remarks: Yup.string(),
});

export default function Page() {
    // @ts-ignore
    const {
        studentRecords,
        records,
        setRecords,
        setTotalDuration,
        setTotalCash,
        setTotalInterac,
    } = useContext(LessonRecordsContext);
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [showNotification, setShowNotification] = useState(false);
    const [query, setQuery] = useState("");

    const filteredPeople =
        query === ""
            ? studentRecords
            : studentRecords.filter((record) => {
                  return record.student.firstName
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    const initialValues: LessonFormValues = {
        selectStudent: "",
        date: formattedToday,
        startTime: "",
        endTime: "",
        paymentType: "Interac",
        paymentAmount: 0,
        roadTest: "No",
        remarks: "",
    };

    const handleSubmit = async (
        values: typeof initialValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const response = await fetch(`/api/${instructorId}/lesson`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                let newRecord = await response.json();

                // Find the student object that matches the studentId from the values
                let student = studentRecords.find(
                    (student) =>
                        student.studentId === newRecord.record.studentId
                );

                if (student) {
                    newRecord.record = {
                        ...newRecord.record,
                        student: student.student,
                        formattedDuration: formatDuration(
                            Number(newRecord.record.duration)
                        ),
                    };
                }

                setRecords((prevRecords) => {
                    const newRecords = [...prevRecords, newRecord.record];

                    newRecords.sort((a, b) => {
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

                    return newRecords;
                });

                const total = calculateTotalDuration([
                    ...records,
                    newRecord.record,
                ]);
                setTotalDuration(total);
                setTotalCash(
                    calculateTotalPayment(
                        [...records, newRecord.record],
                        "Cash"
                    )
                );
                setTotalInterac(
                    calculateTotalPayment(
                        [...records, newRecord.record],
                        "Interac"
                    )
                );

                setShowNotification(true);
                resetForm();

                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Notification
                show={showNotification}
                text={"Lesson"}
                onClose={() => setShowNotification(false)}
            />
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">
                                    Lesson Information
                                </h2>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <Combobox
                                        as="div"
                                        className="sm:col-span-1"
                                        value={values.selectStudent}
                                        onChange={(selectedId) => {
                                            setFieldValue(
                                                "selectStudent",
                                                selectedId
                                            );
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
                                                    const selectedStudent =
                                                        studentRecords.find(
                                                            (record) =>
                                                                record.student
                                                                    .id ===
                                                                values.selectStudent
                                                        );
                                                    return selectedStudent
                                                        ? `${selectedStudent.student.firstName} ${selectedStudent.student.lastName}`
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
                                                    {filteredPeople.map(
                                                        (record) => (
                                                            <Combobox.Option
                                                                key={
                                                                    record
                                                                        .student
                                                                        .id
                                                                }
                                                                value={
                                                                    record
                                                                        .student
                                                                        .id
                                                                }
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                                                        active
                                                                            ? "bg-indigo-600 text-white"
                                                                            : "text-gray-900"
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    selected,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={classNames(
                                                                                "block truncate",
                                                                                selected &&
                                                                                    "font-semibold"
                                                                            )}
                                                                        >
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
                                                        )
                                                    )}
                                                </Combobox.Options>
                                            )}
                                        </div>
                                    </Combobox>
                                    {errors.selectStudent &&
                                    touched.selectStudent ? (
                                        <div className="text-red-500 mt-2 text-sm">
                                            {errors.selectStudent}
                                        </div>
                                    ) : null}

                                    {/* Date */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Date
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                type="date"
                                                name="date"
                                                id="date"
                                                autoComplete="date"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            <ErrorMessage
                                                name="date"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Start Time */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="startTime"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Start Time
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                type="time"
                                                name="startTime"
                                                id="startTime"
                                                autoComplete="startTime"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            <ErrorMessage
                                                name="startTime"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* End Time */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="endTime"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            End Time
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                type="time"
                                                name="endTime"
                                                id="endTime"
                                                autoComplete="endTime"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            <ErrorMessage
                                                name="endTime"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Type */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="paymentType"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Payment Type
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                component="select"
                                                id="paymentType"
                                                name="paymentType"
                                                autoComplete="paymentType"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option>Interac</option>
                                                <option>Cash</option>
                                            </Field>
                                            <ErrorMessage
                                                name="paymentType"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Amount */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="paymentAmount"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Payment Amount
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                type="number"
                                                name="paymentAmount"
                                                id="paymentAmount"
                                                autoComplete="paymentAmount"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            <ErrorMessage
                                                name="paymentAmount"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Road Test */}
                                    <div className="sm:col-span-1">
                                        <label
                                            htmlFor="roadTest"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Road Test
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                component="select"
                                                id="roadTest"
                                                name="roadTest"
                                                autoComplete="roadTest"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option>No</option>
                                                <option>Pass</option>
                                                <option>Fail</option>
                                            </Field>
                                            <ErrorMessage
                                                name="roadTest"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Remarks */}
                                    <div className="sm:col-span-5">
                                        <label
                                            htmlFor="remarks"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Remarks
                                        </label>
                                        <div className="mt-2">
                                            <Field
                                                type="text"
                                                name="remarks"
                                                id="remarks"
                                                autoComplete="remarks"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            <ErrorMessage
                                                name="remarks"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}
