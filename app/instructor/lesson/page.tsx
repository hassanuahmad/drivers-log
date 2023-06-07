// @ts-nocheck
"use client";
import { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../../components/notification";
import { InstructorIdContextType, InstructorIdContext } from "../layout";

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
    // This is a test
    console.log("Testing Lesson");
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);
    if (instructorId) console.log(instructorId);
    const [records, setRecords] = useState([]);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [showNotification, setShowNotification] = useState(false);

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

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/student`)
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            })
            .catch((err) => console.log(err));
    }, [instructorId]);

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
                <Form>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Lesson Information
                            </h2>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/* Select Student */}
                                <div className="sm:col-span-1">
                                    <label
                                        htmlFor="selectStudent"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Select Student
                                    </label>
                                    <div className="mt-2">
                                        <Field
                                            component="select"
                                            id="selectStudent"
                                            name="selectStudent"
                                            autoComplete="selectStudent"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value=""></option>
                                            {records.map((record) => (
                                                <option
                                                    key={record.student.id}
                                                    value={record.student.id}
                                                >
                                                    {record.student.firstName}{" "}
                                                    {record.student.lastName}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="selectStudent"
                                            component="div"
                                            className="text-red-500"
                                        />
                                    </div>
                                </div>

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
            </Formik>
        </>
    );
}
