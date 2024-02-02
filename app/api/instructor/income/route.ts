import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { date, income, incomeMethod, remarks } = await request.json();

    const record = await prisma.income.create({
        data: {
            date: date,
            income: income,
            incomeMethod: incomeMethod,
            remarks: remarks,
            instructorClerkId: userId,
        },
    });

    return NextResponse.json({ message: "Income added.", record });
}

export async function GET(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const selectedMonth = url.searchParams.get("month");
    const selectedYear = url.searchParams.get("year");

    const records = await prisma.income.findMany({
        where: {
            instructorClerkId: userId,
            date: {
                startsWith: `${selectedYear}-${selectedMonth}`,
            },
        },
        orderBy: {
            date: "asc",
        },
    });

    return NextResponse.json({ records });
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.income.update({
        where: {
            id: Number(recordId),
        },
        data: await request.json(),
    });
    return NextResponse.json({ message: "Income updated." });
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.income.delete({
        where: {
            id: Number(recordId),
        },
    });
    return NextResponse.json({ message: "Income deleted." });
}
