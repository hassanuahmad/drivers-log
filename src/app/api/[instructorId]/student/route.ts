import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
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
    } = request;

    // Add code to save the vehicle maintenance record to the database.

    return NextResponse.json({ message: "Student added." });
}
