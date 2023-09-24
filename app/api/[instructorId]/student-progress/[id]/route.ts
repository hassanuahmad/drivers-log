import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string; id: string } }
) {
    // id -> studentId
    const {instructorId, id} = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            studentId: Number(id),
        },
        include: {
            student: true,
        },
    });

    return NextResponse.json({records});
}
