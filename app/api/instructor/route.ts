import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: any) {
    const userInfo = await request.json();

    const findUser = await prisma.instructor.findFirst({
        where: {
            googleId: userInfo.googleId,
        },
    });

    if (findUser) {
        // User already exists
        return NextResponse.json({ body: "User exists" });
    }

    const record = await prisma.instructor.create({
        data: {
            googleId: userInfo.googleId,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.emailAddress,
        },
    });

    return NextResponse.json({ message: "User added", record });
}
