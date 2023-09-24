import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

const prisma = new PrismaClient();

// A type guard for the PrismaClientKnownRequestError
function isPrismaClientKnownRequestError(error: any): error is PrismaClientKnownRequestError {
    return error && typeof error.code === 'string';
}


export async function POST(
    request: Request,
    {params}: { params: { instructorId: string } }
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

    const {instructorId} = params;

    let record;

    try {
        record = await prisma.student.create({
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
    } catch (error) {
        if (isPrismaClientKnownRequestError(error) && error.code === 'P2002') {
            return new NextResponse("Error creating student record.", {
                status: 409, // HTTP 409 Conflict is used to indicate conflicts like duplicate entries
            });
        } else {
            return new NextResponse("Error creating student record.", {
                status: 400,
            });
        }
    }

    await prisma.studentInstructor.create({
        data: {
            studentId: record.id,
            instructorId: Number(instructorId),
        },
    });

    return NextResponse.json({message: "Student added.", record});
}

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;

    if (!instructorId) {
        return new NextResponse("Missing instructorId.", {
            status: 400,
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

    return NextResponse.json({records});
}
