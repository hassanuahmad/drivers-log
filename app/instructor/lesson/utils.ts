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

// @ts-ignore
function convertRecordsToCSV(records) {
    // Define the header of our CSV
    const header = [
        "#",
        "Student Name",
        "Date",
        "Start Time",
        "End Time",
        "Duration",
        "Payment Amount",
        "Payment Type",
        "Road Test",
        "BDE",
        "Lesson Remarks",
        "",
        "Student First Name",
        "Student Last Last",
        "Student Phone Number",
        "Student Email",
        "Student Address",
        "Student Driving Class",
        "Student Remarks",
    ];

    // Convert the records to CSV format
    // @ts-ignore
    const csvRecords = records.map((record, index) => [
        index + 1,
        `"${record.student.firstName} ${record.student.lastName}"`,
        `"${record.date}"`,
        `"${record.startTime}"`,
        `"${record.endTime}"`,
        `"${formatDuration(record.duration)}"`,
        `"${record.paymentAmount}"`,
        `"${record.paymentType}"`,
        `"${record.roadTest}"`,
        `"${record.student.bde}"`,
        `"${record.remarks}"`,
        " ",
        `"${record.student.firstName}"`,
        `"${record.student.lastName}"`,
        `"${record.student.phoneNumber}"`,
        `"${record.student.email}"`,
        `"${record.student.streetAddress} ${record.student.city} ${record.student.province} ${record.student.postalCode} ${record.student.country}"`,
        `"${record.student.drivingClass}"`,
        `"${record.student.remarks}"`,
    ]);

    // Convert the arrays to CSV format
    const csvData = [header, ...csvRecords]
        .map((row) => row.join(","))
        .join("\n");

    return csvData;
}

// Download CSV
// @ts-ignore
export function downloadCSV(records, filename) {
    const csvData = convertRecordsToCSV(records);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
