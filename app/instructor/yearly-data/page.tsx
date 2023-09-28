"use client";
import {useContext, useEffect, useState} from "react";
import {InstructorIdContext} from "@/app/context/instructorIdContext";
import {calculateTotalGasAndMaintenance, getPassRoadTestCount, getTotalHours, getTotalPaymentAmount,} from "./utils";
import SectionHeading from "@/app/components/sectionHeading";
import {Card, CardContent, CardHeader, CardTitle,} from "@/app/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger,} from "@/app/components/ui/select"
import {Label} from "@/app/components/ui/label"

export default function Page() {
    const [lessonRecords, setLessonRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);
    const [vehicleMaintenanceRecords, setVehicleMaintenanceRecords] = useState([]);
    const {totalGas, totalMaintenance} = calculateTotalGasAndMaintenance(vehicleMaintenanceRecords);
    const {instructorId} = useContext(InstructorIdContext);

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
            <SectionHeading title={`${selectedYear} Yearly Data`} description={"View your yearly data."}/>

            <div className={"py-10"}>
                <div className={"pb-4"}>
                    <Label>Select Year</Label>
                    <div className={"mt-2"}>
                        <Select value={selectedYear.toString()}
                                onValueChange={(value) => setSelectedYear(Number(value))}>
                            <SelectTrigger className="w-[180px]">
                                {selectedYear ? selectedYear.toString() : "Select Year"}
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year.toString()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
            </div>
        </>
    );
}
