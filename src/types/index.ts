export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type PropertyType = "APARTMENT" | "VILLA" | "COMMERCIAL" | "LAND" | "MIXED";
export type BudgetRange =
  | "UNDER_50K"
  | "FROM_50K_TO_100K"
  | "FROM_100K_TO_250K"
  | "FROM_250K_TO_500K"
  | "ABOVE_500K";
export type InvestmentGoal = "CAPITAL_GROWTH" | "RENTAL_INCOME" | "BOTH" | "RESIDENCY";
export type InvestmentDuration = "SHORT" | "MEDIUM" | "LONG";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Project {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  images: string[];
  videoUrl?: string;
  googleMapsUrl?: string;
  startingPrice: number;
  minInvestment: number;
  maxInvestment: number;
  expectedReturn: number;
  duration: number;
  riskLevel: RiskLevel;
  propertyType: PropertyType;
  residency: boolean;
  financing: boolean;
  developer?: string;
  pros: string[];
  cons: string[];
  tags: string[];
  matchingRules: MatchingRules;
  createdAt: string;
  updatedAt: string;
}

export interface MatchingRules {
  budgets: BudgetRange[];
  goals: InvestmentGoal[];
  durations: InvestmentDuration[];
  riskLevels: RiskLevel[];
  propertyTypes: PropertyType[];
  residency?: boolean;
  financing?: boolean;
}

export interface AssessmentAnswers {
  budget: BudgetRange;
  goal: InvestmentGoal;
  rentalIncome: boolean;
  duration: InvestmentDuration;
  countries: string[];
  riskLevel: RiskLevel;
  needsFinancing: boolean;
  propertyType: PropertyType;
  residency: boolean;
  name?: string;
  email?: string;
  phone?: string;
}
