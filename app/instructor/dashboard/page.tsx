"use client";
import { useState, useEffect, useContext } from "react";
import { PlusSmallIcon } from "@heroicons/react/20/solid";
import { InstructorIdContextType, InstructorIdContext } from "../layout";
import {
    getTotalHours,
    getTotalPaymentAmount,
    getPassRoadTestCount,
} from "./utils";

export interface User {
    googleId: string | undefined;
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    emailAddress: string | undefined;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
    const [secondaryNavigation, setSecondaryNavigation] = useState([
        { name: "Today", id: "today", current: true },
        { name: "Last 7 days", id: "last-7-days", current: false },
        { name: "Last 30 days", id: "last-30-days", current: false },
    ]);

    const { instructorId }: InstructorIdContextType =
        useContext(InstructorIdContext);
    const [selectedNavigation, setSelectedNavigation] = useState(
        secondaryNavigation[0].id
    );
    const [lessonRecords, setLessonRecords] = useState([]);

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
            name: "Total Revenue",
            value: "$" + getTotalPaymentAmount(lessonRecords),
        },
        {
            name: "Passed Students",
            value: getPassRoadTestCount(lessonRecords),
        },
    ];

    useEffect(() => {
        if (!instructorId) return;
        fetch(`/api/${instructorId}/dashboard/${selectedNavigation}`)
            .then((res) => res.json())
            .then((data) => {
                setLessonRecords(data.lessonRecords);
            })
            .catch((err) => console.log(err));
    }, [instructorId, selectedNavigation]);

    const handleNavigationClick = (name: string) => {
        setSelectedNavigation(name);
        setSecondaryNavigation((prevNavigation) =>
            prevNavigation.map((item) =>
                item.id === name
                    ? { ...item, current: true }
                    : { ...item, current: false }
            )
        );
    };

    return (
        <main>
            <div className="relative isolate overflow-hidden">
                {/* Secondary navigation */}
                <header className="pb-4 pt-6 sm:pb-6">
                    <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
                        <h1 className="text-base font-semibold leading-7 text-gray-900">
                            Summary
                        </h1>
                        <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
                            {secondaryNavigation.map((item) => (
                                <a
                                    key={item.id}
                                    href="#"
                                    className={
                                        item.current
                                            ? "text-indigo-600"
                                            : "text-gray-700"
                                    }
                                    onClick={() =>
                                        handleNavigationClick(item.id)
                                    }
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        {/* Start */}
                        <a
                            href="#"
                            className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <PlusSmallIcon
                                className="-ml-1.5 h-5 w-5"
                                aria-hidden="true"
                            />
                            New invoice
                        </a>
                        {/* End */}
                    </div>
                </header>
            </div>

            <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                    {stats.map((stat, statIdx) => (
                        <div
                            key={stat.name}
                            className={classNames(
                                statIdx % 2 === 1
                                    ? "sm:border-l"
                                    : statIdx === 2
                                    ? "lg:border-l"
                                    : "",
                                "flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
                            )}
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
            </div>
        </main>
    );
}
