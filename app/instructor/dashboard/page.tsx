"use client";
import {useContext, useEffect, useState} from "react";
import {getPassRoadTestCount, getTotalHours, getTotalPaymentAmount,} from "./utils";
import {LessonRecordsDbRow} from "@/app/types/shared/records";
import {InstructorIdContext} from "@/app/context/instructorIdContext";

function classNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
    const [secondaryNavigation, setSecondaryNavigation] = useState([
        {name: "Today", id: "today", current: true},
        {name: "Last 7 days", id: "last-7-days", current: false},
        {name: "Last 30 days", id: "last-30-days", current: false},
    ]);

    const {instructorId} =
        useContext(InstructorIdContext);
    const [selectedNavigation, setSelectedNavigation] = useState(
        secondaryNavigation[0].id
    );
    const [lessonRecords, setLessonRecords] = useState<LessonRecordsDbRow[]>([]);

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
                    ? {...item, current: true}
                    : {...item, current: false}
            )
        );
    };

    return (
        <main>
            <div className="relative isolate overflow-hidden">
                {/* Secondary navigation */}
                <header className="pb-4 pt-6 sm:pb-6 flex justify-between">
                    <div>
                        <h1>Welcome "{"Instructor Name"}</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap">
                        <div
                            className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:pl-6 sm:leading-7">
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
