import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: any, { params }: any) {
    const { id } = params;

    const record = await prisma.vehicleMaintenance.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({ message: "Vehicle maintenance deleted." });
}

export async function PUT(request: any, { params }: any) {
    const { id } = params;

    const record = await prisma.vehicleMaintenance.update({
        where: {
            id: Number(id),
        },
        data: await request.json(),
    });

    return NextResponse.json({ message: "Vehicle maintenance updated." });
}
