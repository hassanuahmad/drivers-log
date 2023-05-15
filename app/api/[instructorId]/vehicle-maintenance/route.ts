import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface vehicleMaintenanceRequest {
    date: string;
    odometer: number;
    fueling: number;
    gas: number;
    maintenance: number;
    remarks: string;
    instructorId: number;
}

export async function POST(request: any) {
    const { date, odometer, fueling, gas, maintenance, remarks } =
        await request.json();

    console.log(date, odometer, fueling, gas, maintenance, remarks);

    // change the instructorId to the one from the URL instead of manually adding it

    const record = await prisma.vehicleMaintenance.create({
        data: {
            date: date,
            odometer: odometer,
            fueling: fueling,
            gas: gas,
            maintenance: maintenance,
            remarks: remarks,
            instructorId: 1,
        },
    });

    return NextResponse.json({ message: "Vehicle maintenance added.", record });
}

export async function GET(request: any) {
    const instructorId = 1;

    const records = await prisma.vehicleMaintenance.findMany({
        where: {
            instructorId: Number(instructorId),
        },
    });

    return NextResponse.json({ records });
}
