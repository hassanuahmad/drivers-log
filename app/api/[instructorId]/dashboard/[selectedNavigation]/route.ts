import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string; selectedNavigation: string } }
) {
    const {instructorId, selectedNavigation} = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    let fromDate = new Date();
    let toDate = new Date();

    if (selectedNavigation === "today") {
        fromDate = new Date();
        toDate = new Date();
    } else if (selectedNavigation === "last-7-days") {
        fromDate.setDate(fromDate.getDate() - 6);
    } else if (selectedNavigation === "last-30-days") {
        fromDate.setDate(fromDate.getDate() - 29);
    } else {
        return NextResponse.json({
            status: 400,
            message: "Invalid navigation option.",
        });
    }

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                gte: fromDate.toISOString().split("T")[0],
                lte: toDate.toISOString().split("T")[0],
            },
        },
    });

    return NextResponse.json({lessonRecords});
}
