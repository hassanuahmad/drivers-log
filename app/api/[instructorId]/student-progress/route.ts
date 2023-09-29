import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string } }
) {
    const {instructorId} = params;
    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    if (!instructorId) {
        return new NextResponse("Missing instructorId.", {
            status: 400,
        });
    }

    const records = await prisma.lesson.findMany({
        where: {
            instructorId: Number(instructorId),
            studentId: Number(recordId),
        },
        include: {
            student: true,
        },
    });

    return NextResponse.json({records});
}
