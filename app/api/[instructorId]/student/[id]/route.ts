import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

const prisma = new PrismaClient();

// A type guard for the PrismaClientKnownRequestError
function isPrismaClientKnownRequestError(error: any): error is PrismaClientKnownRequestError {
    return error && typeof error.code === 'string';
}

export async function DELETE(
    request: Request,
    {params}: { params: { instructorId: string; id: string } }
) {
    const {instructorId, id} = params;

    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                studentId: Number(id),
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
                    statusText:
                        "student has lesson, please delete the lesson first",
                }
            );
        } else {
            await prisma.studentInstructor.deleteMany({
                where: {
                    studentId: Number(id),
                    instructorId: Number(instructorId),
                },
            });

            await prisma.student.delete({
                where: {
                    id: Number(id),
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

export async function PUT(
    request: Request,
    {params}: { params: { id: string } }
) {
    const {id} = params;

    try {
        await prisma.student.update({
            where: {
                id: Number(id),
            },
            data: await request.json(),
        });

        return NextResponse.json({
            message: "Student updated.",
            status: "success",
        });
    } catch (error) {
        if (isPrismaClientKnownRequestError(error) && error.code === 'P2002') {
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
