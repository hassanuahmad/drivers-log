import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {DateTime} from "luxon";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;
    const url = new URL(request.url);
    const timezone = url.searchParams.get('timezone') || 'UTC';

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    let currentDate = DateTime.now().setZone(timezone).minus({days: 31}).toISODate() || undefined;

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                gte: currentDate,
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

    const instructorName = await prisma.instructor.findUnique({
        where: {
            id: Number(instructorId),
        }
    });

    return NextResponse.json({lessonRecords, instructorName});
}
