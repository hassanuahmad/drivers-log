import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Request {
    date: string;
    startTime: string;
    endTime: string;
    paymentType: string;
    paymentAmount: Number;
    roadTest: string;
    remarks: string;
}

export async function POST(request: any, { params }: any) {
    const {
        date,
        startTime,
        endTime,
        paymentType,
        paymentAmount,
        roadTest,
        remarks,
        selectStudent,
    } = await request.json();

    const { instructorId } = params;

    // Parse the startTime and endTime strings to Date objects
    const start = new Date(`1970-01-01T${startTime}:00`); // Adding ":00" for seconds
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Calculate the duration in minutes
    const duration = (end.getTime() - start.getTime()) / 60000;

    const record = await prisma.lesson.create({
        data: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            paymentType: paymentType,
            paymentAmount: paymentAmount,
            roadTest: roadTest,
            remarks: remarks,
            studentId: Number(selectStudent),
            instructorId: Number(instructorId),
        },
    });

    return NextResponse.json({ message: "Lesson added.", record });
}
