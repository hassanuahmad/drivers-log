"use client";
import {useEffect, useState} from "react";
import {filterLessonRecordsByNavigation, isToday, useNavigation,} from "./utils";
import {getPassRoadTestCount, getTotalHours, getTotalPaymentAmount} from "@/app/utils/utils";
import {LessonRecordsPreFormattedDuration} from "@/app/types/shared/records";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/app/components/ui/tabs"
import {DataTable} from "@/app/components/barebone-data-table";
import {columns} from "@/app/instructor/dashboard/columns";

export default function Dashboard() {
    const [secondaryNavigation, setSecondaryNavigation] = useState([
        {name: "Today", id: "today", current: true},
        {name: "Last 7 days", id: "last-7-days", current: false},
        {name: "Last 30 days", id: "last-30-days", current: false},
    ]);
    const [lessonRecords, setLessonRecords] = useState<LessonRecordsPreFormattedDuration[]>([]);
    const [todayLessonRecords, setTodayLessonRecords] = useState<LessonRecordsPreFormattedDuration[]>([]);
    const [instructorName, setInstructorName] = useState<string>("");
    const defaultTab = secondaryNavigation.find(item => item.current)?.id || "";
    const {navigation, selectedNavigation, handleNavigationClick} = useNavigation(secondaryNavigation);
    const displayedLessonRecords = filterLessonRecordsByNavigation(lessonRecords, selectedNavigation);

    const stats = [
        {
            name: "Lessons",
            value: displayedLessonRecords.length,
        },
        {
            name: "Total Hours",
            value: getTotalHours(displayedLessonRecords),
        },
        {
            name: "Total Revenue",
            value: "$" + getTotalPaymentAmount(displayedLessonRecords),
        },
        {
            name: "Passed Students",
            value: getPassRoadTestCount(displayedLessonRecords),
        },
    ];

    useEffect(() => {
        const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
        fetch(`/api/instructor/dashboard?${timezone}`)
            .then((res) => res.json())
            .then((data) => {
                const todayRecords = data.lessonRecords.filter((record: LessonRecordsPreFormattedDuration) => isToday(record.date));
                setInstructorName(data.instructorName.firstName);
                setLessonRecords(data.lessonRecords);
                setTodayLessonRecords(todayRecords);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <main>
            <header className="py-6 border-b border-gray-200 ">
                <div className="flex justify-between pb-4">
                    <div className="max-w-xs flex items-center mr-4">
                        <p className="text-lg font-semibold leading-6 text-gray-900">Welcome {instructorName}!</p>
                    </div>
                    <Tabs defaultValue={defaultTab} onValueChange={handleNavigationClick} className="space-y-4">
                        <TabsList>
                            {secondaryNavigation.map(item => (
                                <TabsTrigger key={item.id} value={item.id}>{item.name}</TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.name}>
                            <Card className="w-full h-full flex flex-col justify-between">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </header>
            <div className="py-10">
                <div>
                    <h2 className="pb-4 text-base font-semibold leading-6 text-gray-900">Today's Lessons</h2>
                    <DataTable columns={columns()} data={todayLessonRecords}/>
                </div>
            </div>
        </main>
    );
}
