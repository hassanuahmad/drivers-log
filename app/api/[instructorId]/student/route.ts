import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Request {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    drivingClass: string;
    bde: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    remarks: string;
}

export async function POST(request: any) {
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

    return NextResponse.json({ message: "Student added.", record });
}

export async function GET(request: any) {
    const records = await prisma.student.findMany();

    return NextResponse.json({ records });
}
