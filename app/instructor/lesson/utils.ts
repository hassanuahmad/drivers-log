import {LessonRecords, LessonRecordsPreFormattedDuration} from "@/app/types/shared/records";

export function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
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

function convertRecordsToCSV(records: LessonRecords[]) {
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
        "Student Street Address",
        "Student City",
        "Student Province",
        "Student Postal Code",
        "Student Country",
        "Student Driving Class",
        "Student Remarks",
    ];

    // Convert the records to CSV format
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
        `"${record.student.streetAddress}"`,
        `"${record.student.city}"`,
        `"${record.student.province}"`,
        `"${record.student.postalCode}"`,
        `"${record.student.country}"`,
        `"${record.student.drivingClass}"`,
        `"${record.student.remarks}"`,
    ]);

    // Convert the arrays to CSV format
    return [header, ...csvRecords]
        .map((row) => row.join(","))
        .join("\n");
}

// Download CSV
export function downloadCSV(records: LessonRecords[], filename: string) {
    const csvData = convertRecordsToCSV(records);
    const blob = new Blob([csvData], {type: "text/csv"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//  The debounced function delays invoking the original function until
//  after `delay` milliseconds have elapsed since the last time the
//  debounced function was invoked.
export function debounce<F extends (...args: any[]) => any>(fn: F, delay: number): (...args: Parameters<F>) => void {
    let timer: ReturnType<typeof setTimeout> | null;
    return function (...args: Parameters<F>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

// Performs a deep equality check between two objects to determine
// if they are equivalent. It checks both the structure and the values
// contained within the objects.
export function isEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) return false;

        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!isEqual(obj1[key], obj2[key])) return false;
        } else if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

