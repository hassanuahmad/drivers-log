type Student = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    drivingClass: string;
    bde: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    remarks: string;
};

type Lesson = {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    paymentType: string;
    paymentAmount: Number;
    roadTest: string;
    remarks: string;
    student: Student;
};

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
}

export function calculateTotalDuration(lessons: Lesson[]): string {
    const totalMinutes = lessons.reduce((acc, curr) => acc + curr.duration, 0);
    return formatDuration(totalMinutes);
}

export function calculateTotalPayment(
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
