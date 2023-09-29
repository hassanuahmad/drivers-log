import {LessonRecordsDbRow, LessonRecordsPreFormattedDuration} from "@/app/types/shared/records";

export function formatDuration(minutes: number) {
    const hours: number = Math.floor(minutes / 60);
    const remainingMinutes: number = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
}

export function getTotalHours(yearlyData: LessonRecordsDbRow[]) {
    const totalMinutes = yearlyData.reduce(
        (acc, lesson) => acc + lesson.duration,
        0
    );
    return formatDuration(totalMinutes);
}

export function getTotalPaymentAmount(yearlyData: LessonRecordsDbRow[]) {
    return yearlyData.reduce(
        (acc, lesson) => acc + lesson.paymentAmount,
        0
    );
}

export function getPassRoadTestCount(yearlyData: LessonRecordsDbRow[]) {
    const passLessons = yearlyData.filter(
        (lesson) => lesson.roadTest === "Pass"
    );
    return passLessons.length;
}

export function calculateTotalDuration(lessons: LessonRecordsPreFormattedDuration[]) {
    const totalMinutes = lessons.reduce((acc, curr) => acc + curr.duration, 0);
    return formatDuration(totalMinutes);
}

export function calculateTotalPayment(lessons: LessonRecordsPreFormattedDuration[], paymentType: string) {
    return lessons.reduce((total, lesson) => {
        if (lesson.paymentType === paymentType) {
            return total + Number(lesson.paymentAmount);
        }
        return total;
    }, 0);
}

export const monthOptions = [
    {label: "January", value: "01"},
    {label: "February", value: "02"},
    {label: "March", value: "03"},
    {label: "April", value: "04"},
    {label: "May", value: "05"},
    {label: "June", value: "06"},
    {label: "July", value: "07"},
    {label: "August", value: "08"},
    {label: "September", value: "09"},
    {label: "October", value: "10"},
    {label: "November", value: "11"},
    {label: "December", value: "12"},
];