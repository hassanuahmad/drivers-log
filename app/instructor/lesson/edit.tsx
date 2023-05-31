import { Formik, Field, ErrorMessage } from "formik";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";

type Student = {
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

type Lesson = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    paymentType: string;
    paymentAmount: number;
    roadTest: string;
    remarks: string;
    student: Student;
};

type LessonWithFormattedDuration = Lesson & {
    formattedDuration: string;
};

interface EditComponentProps {
    record: LessonWithFormattedDuration;
    index: number;
    onEditSave: (
        id: number,
        updatedRecord: LessonWithFormattedDuration
    ) => void;
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
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration,
        paymentType: record.paymentType,
        paymentAmount: record.paymentAmount,
        roadTest: record.roadTest,
        remarks: record.remarks,
    };

    const handleSubmit = async (values: typeof initialValues) => {
        fetch(`/api/1/lesson/${record.id}`, {
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
                            {record.student.firstName} {record.student.lastName}
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.formattedDuration}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {record.student.bde}
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
