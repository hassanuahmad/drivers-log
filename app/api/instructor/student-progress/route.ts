import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function GET(request: Request) {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    const records = await prisma.lesson.findMany({
        where: {
            instructorClerkId: userId,
            studentId: Number(recordId),
        },
        include: {
            student: true,
        },
    });

    records.sort((a, b) => {
        // Compare dates
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
            // If dates are different, return the comparison result
            return dateComparison;
        } else {
            // If dates are the same, compare times
            return a.startTime.localeCompare(b.startTime);
        }
    });

    return NextResponse.json({ records });
}
