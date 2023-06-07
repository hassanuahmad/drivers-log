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

    // Add code to get the instructorId and studentId from the URL instead of manually adding it.

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

export async function GET(request: any, { params }: any) {
    // Add code to get the instructorId from the URL instead of manually adding it.
    const { instructorId } = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

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
