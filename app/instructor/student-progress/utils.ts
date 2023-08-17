export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
}

// @ts-ignore
export function calculateTotalDuration(lessons: Lesson[]): string {
    const totalMinutes = lessons.reduce((acc, curr) => acc + curr.duration, 0);
    return formatDuration(totalMinutes);
}

export function calculateTotalPayment(
    // @ts-ignore
    lessons: Lesson[],
    paymentType: string
): number {
    return lessons.reduce((total, lesson) => {
        if (lesson.paymentType === paymentType) {
            return total + Number(lesson.paymentAmount);
        }
        return total;
    }, 0);
}
