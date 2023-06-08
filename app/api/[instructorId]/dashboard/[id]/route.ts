// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
    const { instructorId, id } = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    let fromDate = new Date();
    let toDate = new Date();

    if (id === "last-7-days") {
        fromDate.setDate(fromDate.getDate() - 6);
    } else if (id === "last-30-days") {
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

    return NextResponse.json({ lessonRecords });
}
