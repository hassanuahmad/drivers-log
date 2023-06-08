import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
    const { instructorId } = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                equals: currentDate,
            },
        },
        include: {
            student: true,
        },
    });

    lessonRecords.sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
            return dateComparison;
        } else {
            return a.startTime.localeCompare(b.startTime);
        }
    });

    return NextResponse.json({ lessonRecords });
}
