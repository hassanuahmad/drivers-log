"use client";
import { useEffect, useState } from "react";
import KebabMenu from "../../components/kebabMenu";

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

export default function View() {
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        fetch("/api/1/student")
            .then((res) => res.json())
            .then((data) => {
                setRecords(data.records);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id: number, endpoint: string) => {
        console.log("DELETE", id, endpoint);
    };

    const handleEdit = (id: number, endpoint: string) => {
        console.log("EDIT", id, endpoint);
        // Your edit handling logic
    };

    return (
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
                                        First Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Last Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Phone Number
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Class
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
                                {records.map((record, index) => (
                                    <tr key={index} className="even:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                            {index + 1}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.firstName}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.lastName}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.phoneNumber}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.email}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.streetAddress} {record.city}{" "}
                                            {record.province}{" "}
                                            {record.postalCode} {record.country}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.drivingClass}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.bde}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {record.remarks}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                            <a
                                                href="#"
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <KebabMenu
                                                    onDelete={() =>
                                                        handleDelete(
                                                            record.id,
                                                            "/api/1/student"
                                                        )
                                                    }
                                                    onEdit={() =>
                                                        handleEdit(
                                                            record.id,
                                                            "/api/1/student"
                                                        )
                                                    }
                                                />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
