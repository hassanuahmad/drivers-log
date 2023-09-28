import {Fragment, useContext, useState} from "react";
import {ErrorMessage, Field, Formik} from "formik";
import {Dialog, Transition} from "@headlessui/react";
import {LessonEditValues} from "@/app/types/pages/lesson";
import {InstructorIdContext} from "@/app/context/instructorIdContext";


export default function Edit({
                                 record,
                                 onEditSave,
                                 onCancel,
                             }: LessonEditValues) {
    const initialValues = {
        date: record.date,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration,
        paymentType: record.paymentType,
        paymentAmount: record.paymentAmount,
        roadTest: record.roadTest,
        remarks: record.remarks,
    };

    const {instructorId} = useContext(InstructorIdContext);
    const [open, setOpen] = useState(true);

    const handleSubmit = async (values: typeof initialValues) => {
        fetch(`/api/${instructorId}/lesson/${record.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then(() => {
                onEditSave(record.id, values);
                onCancel();
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({values, handleSubmit}) => {
                // Adding this function because the handleSubmit function returned by Formik expects a FormEvent
                // but a button's onClick handler gives it a MouseEvent. The two are not compatible.
                const onSubmit = (
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                    e.preventDefault();
                    handleSubmit();
                };

                return (
                    <>
                        {/* START */}
                        <Transition.Root show={open} as={Fragment}>
                            <Dialog
                                as="div"
                                className="relative z-10"
                                onClose={() => {
                                    setOpen(false);
                                    onCancel();
                                }}
                            >
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                                </Transition.Child>

                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <Dialog.Panel
                                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title
                                                            as="h3"
                                                            className="text-base font-semibold leading-6 text-gray-900"
                                                        >
                                                            Edit {record.student.firstName}'s Lesson
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <div
                                                                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                                {/* Date */}
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="date"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
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
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="startTime"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Start
                                                                        Time
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
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="endTime"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
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
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="paymentType"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Payment
                                                                        Type
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <Field
                                                                            component="select"
                                                                            id="paymentType"
                                                                            name="paymentType"
                                                                            autoComplete="paymentType"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                        >
                                                                            <option>
                                                                                Interac
                                                                            </option>
                                                                            <option>
                                                                                Cash
                                                                            </option>
                                                                        </Field>
                                                                        <ErrorMessage
                                                                            name="paymentType"
                                                                            component="div"
                                                                            className="text-red-500"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Payment Amount */}
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="paymentAmount"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Payment
                                                                        Amount
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
                                                                <div className="col-span-1 sm:col-span-3">
                                                                    <label
                                                                        htmlFor="roadTest"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Road
                                                                        Test
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <Field
                                                                            component="select"
                                                                            id="roadTest"
                                                                            name="roadTest"
                                                                            autoComplete="roadTest"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                        >
                                                                            <option>
                                                                                No
                                                                            </option>
                                                                            <option>
                                                                                Pass
                                                                            </option>
                                                                            <option>
                                                                                Fail
                                                                            </option>
                                                                        </Field>
                                                                        <ErrorMessage
                                                                            name="roadTest"
                                                                            component="div"
                                                                            className="text-red-500"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Remarks */}
                                                                <div className="col-span-2 sm:col-span-6">
                                                                    <label
                                                                        htmlFor="remarks"
                                                                        className="block text-left text-sm font-medium leading-6 text-gray-900"
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
                                                </div>
                                                <div
                                                    className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                    <button
                                                        type="submit"
                                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                        onClick={onSubmit}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                        onClick={onCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition.Root>
                    </>
                );
            }}
        </Formik>
    );
}
