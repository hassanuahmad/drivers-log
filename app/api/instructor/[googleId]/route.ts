import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
    const { googleId } = params;

    const record = await prisma.instructor.findFirst({
        where: {
            googleId: googleId,
        },
    });

    if (record) {
        return NextResponse.json({ id: record.id });
    }
}
