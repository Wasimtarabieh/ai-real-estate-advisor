import type { AssessmentAnswers, Project } from "@/types";

export function scoreProject(project: Project, answers: AssessmentAnswers): number {
  const rules = project.matchingRules;
  let score = 0;
  let total = 0;

  total += 30;
  if (rules.budgets.includes(answers.budget)) score += 30;

  total += 20;
  if (rules.goals.includes(answers.goal)) score += 20;

  total += 15;
  if (rules.riskLevels.includes(answers.riskLevel)) score += 15;

  total += 15;
  if (rules.propertyTypes.includes(answers.propertyType)) score += 15;

  total += 10;
  if (rules.durations.includes(answers.duration)) score += 10;

  total += 5;
  if (answers.residency && rules.residency) score += 5;

  total += 5;
  if (answers.needsFinancing && rules.financing) score += 5;

  return total > 0 ? (score / total) * 100 : 0;
}

export function matchProjects(
  projects: Project[],
  answers: AssessmentAnswers
): Array<{ project: Project; score: number }> {
  return projects
    .map((project) => ({ project, score: scoreProject(project, answers) }))
    .filter((r) => r.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
