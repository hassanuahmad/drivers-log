import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function GET(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const selectedYear = url.searchParams.get("year") || undefined;

    const lessonRecords = await prisma.lesson.findMany({
        where: {
            instructorClerkId: userId,
            date: {
                startsWith: selectedYear,
            },
        },
    });

    const startDate = new Date(Number(selectedYear), 0, 1);
    const endDate = new Date(Number(selectedYear), 11, 31);

    const studentRecords = await prisma.studentInstructor.findMany({
        where: {
            instructorClerkId: userId,
            student: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        },
        select: {
            student: true,
        },
    });

    const vehicleMaintenanceRecords = await prisma.vehicleMaintenance.findMany({
        where: {
            instructorClerkId: userId,
            date: {
                startsWith: selectedYear,
            },
        },
    });

    const incomeRecords = await prisma.income.findMany({
        where: {
            instructorClerkId: userId,
            date: {
                startsWith: selectedYear,
            },
        },
    });

    return NextResponse.json({
        lessonRecords,
        studentRecords,
        vehicleMaintenanceRecords,
        incomeRecords,
    });
}
