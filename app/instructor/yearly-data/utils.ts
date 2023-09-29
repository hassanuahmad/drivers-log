import {LessonRecordsDbRow, VehicleMaintenanceRecords} from "@/app/types/shared/records";

export function calculateTotalGasAndMaintenance(yearlyData: VehicleMaintenanceRecords[]) {
    const totalGas = yearlyData.reduce(
        (total, maintenance) => total + maintenance.gas,
        0
    );
    const totalMaintenance = yearlyData.reduce(
        (total, maintenance) => total + maintenance.maintenance,
        0
    );
    return {totalGas, totalMaintenance};
}

export function calculateMonthlyStats(records: LessonRecordsDbRow[]) {
    const monthlyStats = Array(12).fill(0).map(() => ({
        paymentAmount: 0,
        duration: 0,
    }));

    records.forEach(record => {
        const date = new Date(record.date); // assuming record.date is a valid date format
        const month = date.getMonth(); // 0-based index
        monthlyStats[month].paymentAmount += record.paymentAmount;
        monthlyStats[month].duration += record.duration;
    });

    return monthlyStats;
}

export function getTotalHoursInDecimal(yearlyData: LessonRecordsDbRow[]) {
    const totalMinutes = yearlyData.reduce(
        (acc, lesson) => acc + lesson.duration,
        0
    );
    return totalMinutes / 60; // return hours in decimal format
}


