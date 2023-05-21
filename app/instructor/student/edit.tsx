import { Formik, Field, ErrorMessage } from "formik";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";

type Record = {
    id: number;
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
        firstName: record.firstName,
        lastName: record.lastName,
        phoneNumber: record.phoneNumber,
        email: record.email,
        drivingClass: record.drivingClass,
        bde: record.bde,
        streetAddress: record.streetAddress,
        postalCode: record.postalCode,
        city: record.city,
        province: record.province,
        country: record.country,
        remarks: record.remarks,
    };

    const handleSubmit = async (values: typeof initialValues) => {
        fetch(`/api/1/student/${record.id}`, {
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        {/* TODO: Somehow include the other Fields in the edit row */}
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                component="select"
                                id="country"
                                name="country"
                                autoComplete="country"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option>Canada</option>
                                <option>United States</option>
                                <option>Mexico</option>
                            </Field>
                            <ErrorMessage
                                name="country"
                                component="div"
                                className="text-red-500"
                            />
                        </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                component="select"
                                id="drivingClass"
                                name="drivingClass"
                                autoComplete="drivingClass"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option>G2</option>
                                <option>G</option>
                            </Field>
                            <ErrorMessage
                                name="drivingClass"
                                component="div"
                                className="text-red-500"
                            />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <Field
                                component="select"
                                id="bde"
                                name="bde"
                                autoComplete="bde"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </Field>
                            <ErrorMessage
                                name="bde"
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
