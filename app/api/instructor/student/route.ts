import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

// A type guard for the PrismaClientKnownRequestError
function isPrismaClientKnownRequestError(
    error: any,
): error is Prisma.PrismaClientKnownRequestError {
    return error && typeof error.code === "string";
}

export async function POST(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

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

    try {
        const record = await prisma.$transaction(async (prisma) => {
            // Create the student record
            const studentRecord = await prisma.student.create({
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

            // Create the studentInstructor record with the id of the newly created student
            const studentInstructorRecord = await prisma.studentInstructor.create({
                data: {
                    studentId: studentRecord.id,
                    instructorId: 0,
                    instructorClerkId: userId,
                },
            });

            // Return both records as a result
            return studentRecord;
        });

        return NextResponse.json({ message: "Student added.", record });
    } catch (error) {
        if (isPrismaClientKnownRequestError(error) && error.code === "P2002") {
            return new NextResponse("Error creating student record.", {
                status: 409, // HTTP 409 Conflict is used to indicate conflicts like duplicate entries
            });
        } else {
            return new NextResponse("Error creating student record.", {
                status: 400,
            });
        }
    }
}

export async function GET() {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const records = await prisma.studentInstructor.findMany({
        where: {
            instructorClerkId: userId,
        },
        include: {
            student: true,
        },
    });

    return NextResponse.json({ records });
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    try {
        await prisma.student.update({
            where: {
                id: Number(recordId),
            },
            data: await request.json(),
        });

        return NextResponse.json({
            message: "Student updated.",
            status: "success",
        });
    } catch (error) {
        if (isPrismaClientKnownRequestError(error) && error.code === "P2002") {
            return new NextResponse("Error updating student, duplicate", {
                status: 409,
            });
        } else {
            return new NextResponse("Error updating student.", {
                status: 400,
            });
        }
    }
}

export async function DELETE(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                studentId: Number(recordId),
            },
        });

        if (lessons.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "A lesson is associated with the student, delete the lessons before deleting the student.",
                },
                {
                    status: 300,
                    statusText: "student has lesson, please delete the lesson first",
                },
            );
        } else {
            await prisma.studentInstructor.deleteMany({
                where: {
                    studentId: Number(recordId),
                    instructorClerkId: userId,
                },
            });

            await prisma.student.delete({
                where: {
                    id: Number(recordId),
                },
            });

            return NextResponse.json({
                message: "Student deleted.",
                status: "success",
            });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error deleting student.",
            status: "error",
        });
    }
}
