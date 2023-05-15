"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface StudentFormValues {
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
}

const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
        .required("Required"),
    email: Yup.string().email("Invalid email address"),
    drivingClass: Yup.string().required("Required"),
    bde: Yup.string().required("Required"),
    streetAddress: Yup.string().required("Required"),
    postalCode: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    province: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    remarks: Yup.string(),
});

export default function Page() {
    const initialValues: StudentFormValues = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        drivingClass: "G2",
        bde: "No",
        streetAddress: "",
        postalCode: "",
        city: "Windsor",
        province: "ON",
        country: "Canada",
        remarks: "",
    };

    const handleSubmit = (values: typeof initialValues) => {
        try {
            fetch("/api/2/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
        } catch (error) {
            console.error(error);
        }
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
                            Student Information
                        </h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* First Name */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    First name
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Last name
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Phone number
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email address
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="drivingClass"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Driving Class
                                </label>
                                <div className="mt-2">
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
                                </div>
                            </div>

                            {/* BDE */}
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="bde"
                                    className="block text-sm font-medium leading-6 text-gray-900"
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
                                        <option>No</option>
                                        <option>Yes</option>
                                    </Field>
                                    <ErrorMessage
                                        name="bde"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>

                            {/* Street Address */}
                            <div className=" sm:col-span-1 sm:col-start-1">
                                <label
                                    htmlFor="streetAddress"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Street address
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="postalCode"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Postal code / ZIP
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
                            <div className="col-span-1">
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium leading-6 text-gray-900"
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="province"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Province / State
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
                            <div className="sm:col-span-1">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium leading-6 text-gray-900"
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
                                        <option>Canada</option>
                                        <option>United States</option>
                                        <option>Mexico</option>
                                    </Field>
                                    <ErrorMessage
                                        name="country"
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
