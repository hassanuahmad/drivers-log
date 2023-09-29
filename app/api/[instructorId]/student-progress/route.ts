import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    if (!instructorId) {
        return new NextResponse("Missing instructorId.", {
            status: 400,
        });
    }

    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            studentId: Number(recordId),
        },
        include: {
            student: true,
        },
    });

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

    return NextResponse.json({records});
}
