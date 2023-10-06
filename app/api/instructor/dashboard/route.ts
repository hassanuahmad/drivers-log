import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {DateTime} from "luxon";
import {auth} from "@clerk/nextjs";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const {userId}: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", {status: 401});
    }

    const url = new URL(request.url);
    const timezone = url.searchParams.get('timezone') || 'UTC';

    let currentDate = DateTime.now().setZone(timezone).minus({days: 31}).toISODate() || undefined;

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorClerkId: userId,
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
            instructorClerkId: userId,
        }
    });

    return NextResponse.json({lessonRecords, instructorName});
}
