import {LessonRecordsDbRow} from "@/app/types/shared/records";

export function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
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
