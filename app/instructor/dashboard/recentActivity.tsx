// @ts-nocheck
"use client";
import { useEffect, useState, useContext } from "react";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import { Link } from "next/link";

export default function RecentActivity() {
    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);
    const [lessonRecords, setLessonRecords] = useState([]);

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/dashboard`)
            .then((res) => res.json())
            .then((data) => {
                setLessonRecords(data.lessonRecords);
            })
            .catch((err) => console.log(err));
    }, [instructorId]);

    return (
        <div className="space-y-16 py-16 xl:space-y-20">
            <div>
                <h2 className="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">
                    {/* Recent activity */}
                    Today
                </h2>

                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Start Time
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                End Time
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Duration
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Payment
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Road Test
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                BDE
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                            >
                                                <span className="sr-only">
                                                    View More
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {lessonRecords.length === 0 ? (
                                            <tr>
                                                <td
                                                    className="py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
                                                    colSpan={10}
                                                >
                                                    No lessons for today.
                                                </td>
                                            </tr>
                                        ) : (
                                            lessonRecords.map(
                                                (record, index) => (
                                                    <tr key={index}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                record.student
                                                                    .firstName
                                                            }{" "}
                                                            {
                                                                record.student
                                                                    .lastName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.date}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.startTime}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.endTime}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.duration}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            $
                                                            {
                                                                record.paymentAmount
                                                            }{" "}
                                                            -{" "}
                                                            {record.paymentType}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.roadTest}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.student.bde}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                            <a
                                                                href="/instructor/lesson"
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View More
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
