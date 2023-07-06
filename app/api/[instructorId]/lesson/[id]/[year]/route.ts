import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
    // id -> month
    // year -> year
    const { instructorId, id, year } = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                startsWith: `${year}-${id}`,
            },
        },
        include: {
            student: true, // Include the related student data
        },
        orderBy: {
            date: "asc",
        },
    });

    // Sort the records based on date and time
    records.sort((a, b) => {
        // Compare dates
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
            // If dates are different, return the comparison result
            return dateComparison;
        } else {
            // If dates are the same, compare times
            return a.startTime.localeCompare(b.startTime);
        }
    });

    return NextResponse.json({ records });
}
