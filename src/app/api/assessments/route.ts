import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchProjects } from "@/lib/matching";
import type { AssessmentAnswers } from "@/types";

export async function POST(req: Request) {
  const body: AssessmentAnswers = await req.json();

  const assessment = await prisma.assessment.create({
    data: {
      budget: body.budget,
      goal: body.goal,
      rentalIncome: body.rentalIncome,
      duration: body.duration,
      countries: body.countries,
      riskLevel: body.riskLevel,
      needsFinancing: body.needsFinancing,
      propertyType: body.propertyType,
      residency: body.residency,
      name: body.name,
      email: body.email,
      phone: body.phone,
    },
  });

  const allProjects = await prisma.project.findMany();
  const matches = matchProjects(allProjects as never, body);

  await prisma.assessmentResult.createMany({
    data: matches.map((m) => ({
      assessmentId: assessment.id,
      projectId: m.project.id,
      score: m.score,
    })),
  });

  return NextResponse.json({ id: assessment.id });
}

export async function GET() {
  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: { results: { include: { project: true } }, booking: true },
  });
  return NextResponse.json(assessments);
}
