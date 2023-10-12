"use client";
import {useEffect, useState} from "react";
import {calculateMonthlyStats, calculateTotalGasAndMaintenance, calculateTotalIncome} from "./utils";
import {getPassRoadTestCount, getTotalHours, getTotalPaymentAmount} from "@/app/utils/utils";
import SectionHeading from "@/app/components/sectionHeading";
import {Card, CardContent, CardHeader, CardTitle,} from "@/app/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger,} from "@/app/components/ui/select"
import {Label} from "@/app/components/ui/label"
import {MonthlyStat} from "@/app/types/pages/yearly-data";
import DataBarChart from "@/app/components/dataBarChart";

export default function Page() {
    const [lessonRecords, setLessonRecords] = useState([]);
    const [studentRecords, setStudentRecords] = useState([]);
    const [vehicleMaintenanceRecords, setVehicleMaintenanceRecords] = useState([]);
    const [incomeRecords, setIncomeRecords] = useState([]);
    const {totalGas, totalMaintenance} = calculateTotalGasAndMaintenance(vehicleMaintenanceRecords);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

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
            name: "Passed Students",
            value: getPassRoadTestCount(lessonRecords),
        },
        {
            name: "Total Revenue",
            value: "$" + getTotalPaymentAmount(lessonRecords),
        },
        {
            name: "Income",
            value: "$" + calculateTotalIncome(incomeRecords),
        },
        {
            name: "Gas",
            value: "$" + totalGas,
        },
        {
            name: "Maintenance",
            value: "$" + totalMaintenance,
        },

    ];

    const date = new Date();
    const currentYear = date.getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
    ];

    useEffect(() => {
        const params = new URLSearchParams({year: selectedYear.toString()});
        fetch(`/api/instructor/yearly-data?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setLessonRecords(data.lessonRecords);
                setStudentRecords(data.studentRecords);
                setVehicleMaintenanceRecords(data.vehicleMaintenanceRecords);
                setIncomeRecords(data.incomeRecords);
                const stats = calculateMonthlyStats(data.lessonRecords);
                setMonthlyStats(stats);
            })
            .catch((err) => console.log(err));

    }, [selectedYear]);

    const revenueData = [
        {name: "Jan", total: monthlyStats[0]?.paymentAmount || 0},
        {name: "Feb", total: monthlyStats[1]?.paymentAmount || 0},
        {name: "Mar", total: monthlyStats[2]?.paymentAmount || 0},
        {name: "Apr", total: monthlyStats[3]?.paymentAmount || 0},
        {name: "May", total: monthlyStats[4]?.paymentAmount || 0},
        {name: "Jun", total: monthlyStats[5]?.paymentAmount || 0},
        {name: "Jul", total: monthlyStats[6]?.paymentAmount || 0},
        {name: "Aug", total: monthlyStats[7]?.paymentAmount || 0},
        {name: "Sep", total: monthlyStats[8]?.paymentAmount || 0},
        {name: "Oct", total: monthlyStats[9]?.paymentAmount || 0},
        {name: "Nov", total: monthlyStats[10]?.paymentAmount || 0},
        {name: "Dec", total: monthlyStats[11]?.paymentAmount || 0},
    ];
    const hoursData = [
        {name: "Jan", total: (monthlyStats[0]?.duration || 0) / 60},
        {name: "Feb", total: (monthlyStats[1]?.duration || 0) / 60},
        {name: "Mar", total: (monthlyStats[2]?.duration || 0) / 60},
        {name: "Apr", total: (monthlyStats[3]?.duration || 0) / 60},
        {name: "May", total: (monthlyStats[4]?.duration || 0) / 60},
        {name: "Jun", total: (monthlyStats[5]?.duration || 0) / 60},
        {name: "Jul", total: (monthlyStats[6]?.duration || 0) / 60},
        {name: "Aug", total: (monthlyStats[7]?.duration || 0) / 60},
        {name: "Sep", total: (monthlyStats[8]?.duration || 0) / 60},
        {name: "Oct", total: (monthlyStats[9]?.duration || 0) / 60},
        {name: "Nov", total: (monthlyStats[10]?.duration || 0) / 60},
        {name: "Dec", total: (monthlyStats[11]?.duration || 0) / 60},
    ];

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

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-8 mt-6">
                    <div className={"grid-cols-1 lg:col-span-4"}>
                        <DataBarChart title={"Hours Overview"} data={hoursData} formatter={(value) => `${value}hr`}/>
                    </div>
                    <div className={"grid-cols-1 lg:col-span-4"}>
                        <DataBarChart title={"Revenue Overview"} data={revenueData} formatter={(value) => `$${value}`}/>
                    </div>
                </div>
            </div>
        </>
    );
}
