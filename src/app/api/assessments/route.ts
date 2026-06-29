import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function scoreProject(project: {
  forLiving: boolean; forVacation: boolean; forInvestment: boolean;
  offPlan: boolean; ready: boolean;
  commercial: boolean; touristic: boolean; residential: boolean; agricultural: boolean; buildingPlot: boolean;
  monthlyRental: boolean; shortSale: boolean; longSale: boolean;
  budgets: string[];
}, answers: Record<string, string>): number {
  let score = 0;

  const purposeMap: Record<string, keyof typeof project> = {
    living: "forLiving", vacation: "forVacation", investment: "forInvestment",
  };
  if (answers.purpose && project[purposeMap[answers.purpose]]) score += 30;

  const statusMap: Record<string, keyof typeof project> = {
    off_plan: "offPlan", ready: "ready",
  };
  if (answers.status === "opportunity") score += 15;
  else if (answers.status && project[statusMap[answers.status]]) score += 20;

  const typeMap: Record<string, keyof typeof project> = {
    commercial: "commercial", touristic: "touristic", residential: "residential",
    agricultural: "agricultural", plot: "buildingPlot",
  };
  if (answers.type === "unsure") score += 10;
  else if (answers.type && project[typeMap[answers.type]]) score += 25;

  const priorityMap: Record<string, keyof typeof project> = {
    rental: "monthlyRental", short_sale: "shortSale", long_sale: "longSale",
  };
  if (answers.priority === "both") score += 10;
  else if (answers.priority && project[priorityMap[answers.priority]]) score += 15;

  if (project.budgets.includes(answers.budget) || project.budgets.includes("flexible")) score += 10;

  return score;
}

export async function POST(req: Request) {
  const answers = await req.json();

  const assessment = await prisma.assessment.create({
    data: {
      purpose: answers.purpose ?? "",
      status: answers.status ?? "",
      propertyType: answers.type ?? "",
      priority: answers.priority ?? "",
      saleTimeline: answers.timeline ?? "",
      budget: answers.budget ?? "",
    },
  });

  const projects = await prisma.project.findMany({ where: { isActive: true } });
  const scored = projects
    .map((p) => ({ project: p, score: scoreProject(p, answers) }))
    .filter((r) => r.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scored.length > 0) {
    await prisma.assessmentResult.createMany({
      data: scored.map((r) => ({ assessmentId: assessment.id, projectId: r.project.id, score: r.score })),
    });
  }

  return NextResponse.json({ id: assessment.id });
}

export async function GET() {
  const list = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: { results: true, lead: true },
  });
  return NextResponse.json(list);
}
