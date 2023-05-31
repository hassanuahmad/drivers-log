import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: any, { params }: any) {
    const { id } = params;

    const record = await prisma.lesson.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({ message: "Lesson deleted." });
}

export async function PUT(request: any, { params }: any) {
    const { id } = params;

    const {
        date,
        startTime,
        endTime,
        paymentType,
        paymentAmount,
        roadTest,
        remarks,
    } = await request.json();

    // Parse the startTime and endTime strings to Date objects
    const start = new Date(`1970-01-01T${startTime}:00`); // Adding ":00" for seconds
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Calculate the duration in minutes
    const duration = (end.getTime() - start.getTime()) / 60000;

    const record = await prisma.lesson.update({
        where: {
            id: Number(id),
        },
        data: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            paymentType: paymentType,
            paymentAmount: paymentAmount,
            roadTest: roadTest,
            remarks: remarks,
        },
    });

    return NextResponse.json({ message: "Lesson updated." });
}
