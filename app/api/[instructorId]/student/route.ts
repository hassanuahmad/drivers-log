import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { instructorId: string } }
) {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        drivingClass,
        bde,
        streetAddress,
        postalCode,
        city,
        province,
        country,
        remarks,
    } = await request.json();

    const { instructorId } = params;

    const record = await prisma.student.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            drivingClass: drivingClass,
            bde: bde,
            streetAddress: streetAddress,
            postalCode: postalCode,
            city: city,
            province: province,
            country: country,
            remarks: remarks,
        },
    });

    await prisma.studentInstructor.create({
        data: {
            studentId: record.id,
            instructorId: Number(instructorId),
        },
    });

    return NextResponse.json({ message: "Student added.", record });
}

export async function GET(
    request: Request,
    { params }: { params: { instructorId: string } }
) {
    const { instructorId } = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    const records = await prisma.studentInstructor.findMany({
        where: {
            instructorId: Number(instructorId),
        },
        include: {
            student: true,
        },
    });

    return NextResponse.json({ records });
}
