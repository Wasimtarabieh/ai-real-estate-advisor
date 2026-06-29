import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, phone, assessmentId, projectId } = await req.json();
  const lead = await prisma.lead.create({
    data: { name, email, phone: phone || null, assessmentId, projectId: projectId || null },
  });
  return NextResponse.json(lead);
}

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { assessment: true },
  });
  return NextResponse.json(leads);
}
