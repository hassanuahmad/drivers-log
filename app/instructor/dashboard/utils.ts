export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
}

export function getTotalHours(yearlyData: any) {
    const totalMinutes = yearlyData.reduce(
        (acc: number, lesson: any) => acc + lesson.duration,
        0
    );
    return formatDuration(totalMinutes);
}

export function getTotalPaymentAmount(yearlyData: any) {
    const totalPaymentAmount = yearlyData.reduce(
        (acc: number, lesson: any) => acc + lesson.paymentAmount,
        0
    );
    return totalPaymentAmount;
}

export function getPassRoadTestCount(yearlyData: any) {
    const passLessons = yearlyData.filter(
        (lesson: any) => lesson.roadTest === "Pass"
    );
    const passCount = passLessons.length;
    return passCount;
}
