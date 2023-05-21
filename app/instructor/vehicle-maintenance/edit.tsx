import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { PlusSmallIcon } from "@heroicons/react/20/solid";
type Record = {
    id: number;
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
};

interface EditComponentProps {
    record: Record;
    index: number;
    onEditSave: (id: number, updatedRecord: Record) => void;
    onCancel: () => void;
}

export default function Edit({
    record,
    index,
    onEditSave,
    onCancel,
}: EditComponentProps) {
    const initialValues = {
        date: record.date,
        odometer: record.odometer,
        fueling: record.fueling,
        gas: record.gas,
        maintenance: record.maintenance,
        remarks: record.remarks,
    };

    const handleSubmit = async (values: typeof initialValues) => {
        fetch(`/api/1/vehicle-maintenance/${record.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                // @ts-ignore TODO: Fix this
                onEditSave(record.id, values);
                onCancel();
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, handleSubmit }) => {
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
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                type="number"
                                name="odometer"
                                id="odometer"
                                autoComplete="odometer"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <ErrorMessage
                                name="odometer"
                                component="div"
                                className="text-red-500"
                            />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                type="number"
                                name="fueling"
                                id="fueling"
                                autoComplete="fueling"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <ErrorMessage
                                name="fueling"
                                component="div"
                                className="text-red-500"
                            />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                type="number"
                                name="gas"
                                id="gas"
                                autoComplete="gas"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <ErrorMessage
                                name="gas"
                                component="div"
                                className="text-red-500"
                            />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                type="number"
                                name="maintenance"
                                id="maintenance"
                                autoComplete="maintenance"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <ErrorMessage
                                name="maintenance"
                                component="div"
                                className="text-red-500"
                            />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        {/* TODO: Make this look better */}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button
                                type="submit"
                                className="pr-4"
                                onClick={onSubmit}
                            >
                                <CheckIcon className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={onCancel}>
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </>
                );
            }}
        </Formik>
    );
}
