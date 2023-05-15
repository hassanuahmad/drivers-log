import { NextResponse } from "next/server";

interface Request {
    selectStudent: string;
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
        selectStudent,
        date,
        startTime,
        endTime,
        paymentType,
        paymentAmount,
        roadTest,
        remarks,
    } = await request.json();

    console.log(
        selectStudent,
        date,
        startTime,
        endTime,
        paymentType,
        paymentAmount,
        roadTest,
        remarks
    );

    // Also add code to calulate the duration of the lesson and add it to the database.

    // Add code to save the lesson record to the database.

    return NextResponse.json({ message: "Lesson added." });
}
