import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
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

    const {instructorId} = params;

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

    return NextResponse.json({message: "Lesson added.", record});
}

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;
    const url = new URL(request.url);
    const selectedMonth = url.searchParams.get("month");
    const selectedYear = url.searchParams.get("year");

    if (!instructorId) {
        return new NextResponse("Missing instructorId.", {
            status: 400,
        });
    }

    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                startsWith: `${selectedYear}-${selectedMonth}`,
            },
        },
        include: {
            student: true,
        },
        orderBy: {
            date: "asc",
        },
    });

    // Sort the records based on date and time
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

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

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
    await prisma.lesson.update({
        where: {
            id: Number(recordId),
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
    return NextResponse.json({message: "Lesson updated."});
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.lesson.delete({
        where: {
            id: Number(recordId),
        },
    });
    return NextResponse.json({message: "Lesson deleted."});
}

