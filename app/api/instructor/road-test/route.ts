import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
    const { date, location, testTime, remarks, selectStudent } =
        await request.json();

    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const record = await prisma.roadTest.create({
        data: {
            date: date,
            testTime: testTime,
            location: location,
            remarks: remarks,
            studentId: Number(selectStudent),
            instructorClerkId: userId,
        },
    });

    return NextResponse.json({ message: "Road Test added.", record });
}

export async function GET(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const selectedMonth = url.searchParams.get("month");
    const selectedYear = url.searchParams.get("year");
    const records = await prisma.roadTest.findMany({
        where: {
            instructorClerkId: userId,
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
            return a.testTime.localeCompare(b.testTime);
        }
    });

    return NextResponse.json({ records });
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    const { date, testTime, location, remarks } = await request.json();

    await prisma.roadTest.update({
        where: {
            id: Number(recordId),
        },
        data: {
            date: date,
            testTime: testTime,
            location: location,
            remarks: remarks,
        },
    });
    return NextResponse.json({ message: "Road Test updated." });
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.roadTest.delete({
        where: {
            id: Number(recordId),
        },
    });
    return NextResponse.json({ message: "Road Test deleted." });
}
