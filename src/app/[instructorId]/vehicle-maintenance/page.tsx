"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface VehicleMaintenanceFormValues {
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
}

const validationSchema = Yup.object({
    date: Yup.date().required("Required"),
    odometer: Yup.number().integer(),
    fueling: Yup.number().integer(),
    gas: Yup.number().integer(),
    maintenance: Yup.number().integer(),
    remarks: Yup.string(),
});

export default function Page() {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const initialValues: VehicleMaintenanceFormValues = {
        date: formattedToday,
        odometer: 0,
        fueling: 0,
        gas: 0,
        maintenance: 0,
        remarks: "",
    };

    const handleSubmit = (values: typeof initialValues) => {
        console.log(values);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            <Form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Vehicle Maintenance
                        </h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

                            {/* Odometer */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="odometer"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Odometer
                                </label>
                                <div className="mt-2">
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
                                </div>
                            </div>

                            {/* Fueling */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="fueling"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Fueling
                                </label>
                                <div className="mt-2">
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
                                </div>
                            </div>

                            {/* Gas */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="gas"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Gas
                                </label>
                                <div className="mt-2">
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
                                </div>
                            </div>

                            {/* Maintenance */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="maintenance"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Maintenance
                                </label>
                                <div className="mt-2">
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
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="sm:col-span-1">
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
    );
}
