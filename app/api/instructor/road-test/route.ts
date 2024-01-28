import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const { date, location, testTime, remarks, selectStudent } =
    await request.json();

  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const record = await prisma.roadTest.create({
    data: {
      date: date,
      testTime: testTime,
      location: location,
      remarks: remarks,
      studentId: Number(selectStudent),
      instructorClerkId: userId,
    },
  });

  return NextResponse.json({ message: "Road Test added.", record });
}
