import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { instructorId: string } }
) {
    const { date, odometer, fueling, gas, maintenance, remarks } =
        await request.json();

    const { instructorId } = params;

    const record = await prisma.vehicleMaintenance.create({
        data: {
            date: date,
            odometer: odometer,
            fueling: fueling,
            gas: gas,
            maintenance: maintenance,
            remarks: remarks,
            instructorId: Number(instructorId),
        },
    });

    return NextResponse.json({ message: "Vehicle maintenance added.", record });
}
