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

export async function POST(request: any) {
    const {
        date,
        startTime,
        endTime,
        paymentType,
        paymentAmount,
        roadTest,
        remarks,
    } = await request.json();

    // Also add code to calulate the duration of the lesson and add it to the database.

    // Add code to get the instructorId and studentId from the URL instead of manually adding it.

    // Add code to save the lesson record to the database.
    const record = await prisma.lesson.create({
        data: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            duration: 120,
            paymentType: paymentType,
            paymentAmount: paymentAmount,
            roadTest: roadTest,
            remarks: remarks,
            studentId: 1,
            instructorId: 1,
        },
    });

    return NextResponse.json({ message: "Lesson added.", record });
}

export async function GET(request: any) {
    // Add code to get the instructorId from the URL instead of manually adding it.
    const instructorId = 1;

    // Add code to get the lessons for the instructorId from the database.
    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
        },
        include: {
            student: true, // Include the related student data
        },
    });

    return NextResponse.json({ records });
}
