"use client";
import {Fragment, useContext, useEffect, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {calculateTotalGasAndMaintenance, getPassRoadTestCount, getTotalHours, getTotalPaymentAmount,} from "./utils";

function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Page() {
    const [lessonRecords, setLessonRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);
    const [vehicleMaintenanceRecords, setVehicleMaintenanceRecords] = useState(
        []
    );
    const {totalGas, totalMaintenance} = calculateTotalGasAndMaintenance(
        vehicleMaintenanceRecords
    );
    const {instructorId} =
        useContext(InstructorIdContext);

    const stats = [
        {
            name: "Lessons",
            value: lessonRecords.length,
        },
        {
            name: "Total Hours",
            value: getTotalHours(lessonRecords),
        },
        {
            name: "Students",
            value: studentRecords.length,
        },
        {
            name: "Total Revenue",
            value: "$" + getTotalPaymentAmount(lessonRecords),
        },
        {
            name: "Gas",
            value: "$" + totalGas,
        },
        {
            name: "Maintenance",
            value: "$" + totalMaintenance,
        },
        {
            name: "Passed Students",
            value: getPassRoadTestCount(lessonRecords),
        },
        {},
    ];

    const date = new Date();
    const currentYear = date.getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/yearly-data/${selectedYear}`)
            .then((res) => res.json())
            .then((data) => {
                setLessonRecords(data.lessonRecords);
                setStudentRecords(data.studentRecords);
                setVehicleMaintenanceRecords(data.vehicleMaintenanceRecords);
            })
            .catch((err) => console.log(err));
    }, [instructorId, selectedYear]);

    return (
        <>
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {selectedYear} Annual Summary
                        </h3>
                    </div>
                    <div className="ml-4 mt-2 flex-shrink-0">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {selectedYear}
                                    <ChevronDownIcon
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {years.map((year, index) => (
                                            <Menu.Item key={index}>
                                                {({active}) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                        onClick={(e) => {
                                                            setSelectedYear(
                                                                year
                                                            );
                                                        }}
                                                    >
                                                        {year}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>

            <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
                    >
                        <dt className="text-sm font-medium leading-6 text-gray-500">
                            {stat.name}
                        </dt>
                        <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </>
    );
}
