import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {auth} from "@clerk/nextjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const {userId}: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", {status: 401});
    }

    const {date, odometer, fueling, gas, maintenance, remarks} =
        await request.json();

    const record = await prisma.vehicleMaintenance.create({
        data: {
            date: date,
            odometer: odometer,
            fueling: fueling,
            gas: gas,
            maintenance: maintenance,
            remarks: remarks,
            instructorId: 0,
            instructorClerkId: userId,
        },
    });

    return NextResponse.json({message: "Vehicle maintenance added.", record});
}

export async function GET(request: Request) {
    const {userId}: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", {status: 401});
    }

    const url = new URL(request.url);
    const selectedMonth = url.searchParams.get("month");
    const selectedYear = url.searchParams.get("year");

    const records = await prisma.vehicleMaintenance.findMany({
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

    return NextResponse.json({records});
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.vehicleMaintenance.update({
        where: {
            id: Number(recordId),
        },
        data: await request.json(),
    });
    return NextResponse.json({message: "Vehicle maintenance updated."});
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");
    await prisma.vehicleMaintenance.delete({
        where: {
            id: Number(recordId),
        },
    });
    return NextResponse.json({message: "Vehicle maintenance deleted."});
}


