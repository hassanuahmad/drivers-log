import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;
    const url = new URL(request.url);
    const selectedYear = url.searchParams.get("year") || undefined;

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                startsWith: selectedYear,
            },
        },
    });

    const startDate = new Date(Number(selectedYear), 0, 1);
    const endDate = new Date(Number(selectedYear), 11, 31);

    const studentRecords = await prisma.student.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
    });

    const vehicleMaintenanceRecords = await prisma.vehicleMaintenance.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                startsWith: selectedYear,
            },
        },
    });

    return NextResponse.json({
        lessonRecords,
        studentRecords,
        vehicleMaintenanceRecords,
    });
}
