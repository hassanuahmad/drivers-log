import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    {params}: { params: { instructorId: string; id: string; year: string } }
) {
    // id -> month
    // year -> year
    const {instructorId, id, year} = params;

    if (!instructorId) {
        return NextResponse.json({
            status: 400,
            message: "Missing instructorId.",
        });
    }

    const records = await prisma.vehicleMaintenance.findMany({
        where: {
            instructorId: Number(instructorId),
            date: {
                startsWith: `${year}-${id}`,
            },
        },
        orderBy: {
            date: "asc",
        },
    });

    return NextResponse.json({records});
}
