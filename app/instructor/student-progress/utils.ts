// @ts-ignore
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

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

// !!! THIS IS ONLY FOR MY FATHER CURRENTLY !!!
// @ts-ignore
export const generateDoc = async (records, instructorId) => {
    try {
        // the template is in the public folder!
        const response = await fetch("/bde-report.docx");
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const zip = new PizZip(arrayBuffer);

        const doc = new Docxtemplater().loadZip(zip);

        // Prepare your records, filling in with '-' if less than 10
        // @ts-ignore
        const preparedRecords = records.slice(0, 10).map((record, index) => ({
            i: index + 1,
            // @ts-ignore
            de: record.date || "-",
            // @ts-ignore
            ti: record.startTime || "-",
            // @ts-ignore
            to: record.endTime || "-",
            // @ts-ignore
            tt: record.formattedDuration || "-",
        }));

        // Fill in remaining rows to make 10
        let nextIndex = preparedRecords.length + 1;
        while (preparedRecords.length < 10) {
            preparedRecords.push({
                i: nextIndex,
                de: "-",
                ti: "-",
                to: "-",
                tt: "-",
            });
            nextIndex++;
        }

        // Get instructor-specific values from environment variables or set them to 'XYZ'
        //instructor name
        const iName =
            instructorId === 14
                ? process.env.NEXT_PUBLIC_INSTRUCTOR_NAME
                : "XYZ";
        //instructor licence
        const iLicence =
            instructorId === 14
                ? process.env.NEXT_PUBLIC_INSTRUCTOR_LICENCE
                : "XYZ";
        //instructor expiry date
        const iExpiry =
            instructorId === 14
                ? process.env.NEXT_PUBLIC_INSTRUCTOR_LICENCE_EXPIRY
                : "XYZ";
        //ontario licence
        const oLicence =
            instructorId === 14
                ? process.env.NEXT_PUBLIC_ONTARIO_LICENCE
                : "XYZ";

        // Set the template variables
        doc.setData({
            // @ts-ignore
            firstName: records[0].student.firstName.toUpperCase(),
            // @ts-ignore
            lastName: records[0].student.lastName.toUpperCase(),
            address:
                // @ts-ignore
                records[0].student.streetAddress +
                " " +
                // @ts-ignore
                records[0].student.city +
                ", " +
                // @ts-ignore
                records[0].student.province +
                " " +
                // @ts-ignore
                records[0].student.postalCode,
            // @ts-ignore
            phoneNumber: records[0].student.phoneNumber,
            r: preparedRecords,
            iName,
            iLicence,
            iExpiry,
            oLicence,
        });

        try {
            // Apply the data to the template
            doc.render();
        } catch (error) {
            // @ts-ignore
            console.error("Template Errors:", error.properties.errors);
        }

        const out = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Output the document using FileSaver.js
        saveAs(
            out,
            // @ts-ignore
            `${records[0].student.firstName} ${records[0].student.lastName} BDE Report.docx`
        );
    } catch (error) {
        console.error("Error occurred:", error);
    }
};
