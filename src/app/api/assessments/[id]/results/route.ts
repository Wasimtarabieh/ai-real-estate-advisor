import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const results = await prisma.assessmentResult.findMany({
    where: { assessmentId: id },
    include: { project: true },
    orderBy: { score: "desc" },
  });
  return NextResponse.json(results);
}
