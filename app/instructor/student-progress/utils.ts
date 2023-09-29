import {saveAs} from "file-saver";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {LessonRecords} from "@/app/types/shared/records";
import {DocxTemplateError} from "@/app/types/pages/studentProgress";

// !!! THIS IS ONLY FOR MY FATHER CURRENTLY !!!
export const generateDoc = async (records: LessonRecords[], instructorId: number) => {
    try {
        // the template is in the public folder!
        const response = await fetch("/bde-report.docx");
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const zip = new PizZip(arrayBuffer);

        const doc = new Docxtemplater().loadZip(zip);

        // Prepare your records, filling in with '-' if less than 10
        const preparedRecords = records.slice(0, 10).map((record, index) => ({
            i: index + 1,
            de: record.date || "-",
            ti: record.startTime || "-",
            to: record.endTime || "-",
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
            firstName: records[0].student.firstName.toUpperCase(),
            lastName: records[0].student.lastName.toUpperCase(),
            address:
                records[0].student.streetAddress +
                " " +
                records[0].student.city +
                ", " +
                records[0].student.province +
                " " +
                records[0].student.postalCode,
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
            const typedError = error as { properties: { errors: DocxTemplateError } };
            console.error("Template Errors:", typedError.properties.errors);
        }

        const out = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Output the document using FileSaver.js
        saveAs(
            out,
            `${records[0].student.firstName} ${records[0].student.lastName} BDE Report.docx`
        );
    } catch (error) {
        console.error("Error occurred:", error);
    }
};
