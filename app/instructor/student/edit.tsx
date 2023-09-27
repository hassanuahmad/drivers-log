import {Fragment, useContext, useState} from "react";
import {ErrorMessage, Field, Formik} from "formik";
import {Dialog, Transition} from "@headlessui/react";
import {XCircleIcon} from '@heroicons/react/20/solid'
import {StudentEditValues} from "@/app/types/pages/student";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

export default function Edit({
                                 record,
                                 onEditSave,
                                 onCancel,
                             }: StudentEditValues) {
    const initialValues = {
        firstName: record.student.firstName,
        lastName: record.student.lastName,
        phoneNumber: record.student.phoneNumber,
        email: record.student.email,
        drivingClass: record.student.drivingClass,
        bde: record.student.bde,
        streetAddress: record.student.streetAddress,
        postalCode: record.student.postalCode,
        city: record.student.city,
        province: record.student.province,
        country: record.student.country,
        remarks: record.student.remarks,
    };

    const {instructorId} =
        useContext(InstructorIdContext);
    const [open, setOpen] = useState(true);
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const response = await fetch(`/api/${instructorId}/student/${record.student.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            // Conflict
            if (response.status === 409) {
                setShowErrorNotification(true);
                setTimeout(() => {
                    setShowErrorNotification(false);
                }, 3000);
            } else if (response.ok) {
                onEditSave(record.id, values);
                onCancel();
            } else {
                console.error("Unexpected error occurred during update.");
            }
        } catch (error) {
            console.error("Updating Error:", error);
        }
    };

    return (
        <>
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
                                                                Edit {initialValues.firstName}'s Record
                                                            </Dialog.Title>
                                                            <div className="mt-2">
                                                                <div
                                                                    className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                                    {/* First Name */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="firstName"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            First
                                                                            name
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="firstName"
                                                                                id="firstName"
                                                                                autoComplete="firstName"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="firstName"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Last Name */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="lastName"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Last
                                                                            name
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="lastName"
                                                                                id="lastName"
                                                                                autoComplete="lastName"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="lastName"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Phone Number */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="phoneNumber"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Phone
                                                                            number
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                id="phoneNumber"
                                                                                name="phoneNumber"
                                                                                type="tel"
                                                                                autoComplete="tel"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="phoneNumber"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Email */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="email"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Email
                                                                            address
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                id="email"
                                                                                name="email"
                                                                                type="email"
                                                                                autoComplete="email"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="email"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Driving Class */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="drivingClass"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Driving
                                                                            Class
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                component="select"
                                                                                id="drivingClass"
                                                                                name="drivingClass"
                                                                                autoComplete="drivingClass"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                            >
                                                                                <option>
                                                                                    G2
                                                                                </option>
                                                                                <option>
                                                                                    G
                                                                                </option>
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                name="drivingClass"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* BDE */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="bde"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            BDE
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                component="select"
                                                                                id="bde"
                                                                                name="bde"
                                                                                autoComplete="bde"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                            >
                                                                                <option>
                                                                                    No
                                                                                </option>
                                                                                <option>
                                                                                    Yes
                                                                                </option>
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                name="bde"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Street Address */}
                                                                    <div className="col-span-2 sm:col-span-6">
                                                                        <label
                                                                            htmlFor="streetAddress"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Street
                                                                            address
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="streetAddress"
                                                                                id="streetAddress"
                                                                                autoComplete="streetAddress"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="streetAddress"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Postal code */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="postalCode"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Postal
                                                                            code /
                                                                            ZIP
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="postalCode"
                                                                                id="postalCode"
                                                                                autoComplete="postalCode"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="postalCode"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* City */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="city"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            City
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="city"
                                                                                id="city"
                                                                                autoComplete="city"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="city"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Province */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="province"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Province
                                                                            / State
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                type="text"
                                                                                name="province"
                                                                                id="province"
                                                                                autoComplete="province"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <ErrorMessage
                                                                                name="province"
                                                                                component="div"
                                                                                className="text-red-500"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Country */}
                                                                    <div className="col-span-1 sm:col-span-3">
                                                                        <label
                                                                            htmlFor="country"
                                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                                        >
                                                                            Country
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <Field
                                                                                component="select"
                                                                                id="country"
                                                                                name="country"
                                                                                autoComplete="country"
                                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                                            >
                                                                                <option>
                                                                                    Canada
                                                                                </option>
                                                                                <option>
                                                                                    United
                                                                                    States
                                                                                </option>
                                                                                <option>
                                                                                    Mexico
                                                                                </option>
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                name="country"
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
                                                                    {showErrorNotification && (
                                                                        <div className="col-span-2 sm:col-span-6">
                                                                            <div className="rounded-md bg-red-50 p-4">
                                                                                <div className="flex">
                                                                                    <div className="flex-shrink-0">
                                                                                        <XCircleIcon
                                                                                            className="h-5 w-5 text-red-400"
                                                                                            aria-hidden="true"/>
                                                                                    </div>
                                                                                    <div className="ml-3">
                                                                                        <h3 className="text-sm font-medium text-red-800 text-left">Cannot
                                                                                            update student. Student
                                                                                            already
                                                                                            exists.</h3>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
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
        </>
    );
}
