import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: any, { params }: any) {
    const { id } = params;

    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                studentId: Number(id),
            },
        });

        if (lessons.length > 0) {
            return NextResponse.json({
                message:
                    "A lesson is associated with the student, delete the lessons before deleting the student.",
                status: "error",
            });
        } else {
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
