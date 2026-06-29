"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AssessmentAnswers, BudgetRange, InvestmentGoal, InvestmentDuration, RiskLevel, PropertyType } from "@/types";

const STEPS = [
  "budget",
  "goal",
  "rentalIncome",
  "duration",
  "countries",
  "riskLevel",
  "needsFinancing",
  "propertyType",
  "residency",
  "contact",
] as const;

type Step = (typeof STEPS)[number];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "UNDER_50K", label: "Under $50,000" },
  { value: "FROM_50K_TO_100K", label: "$50,000 – $100,000" },
  { value: "FROM_100K_TO_250K", label: "$100,000 – $250,000" },
  { value: "FROM_250K_TO_500K", label: "$250,000 – $500,000" },
  { value: "ABOVE_500K", label: "Above $500,000" },
];

const GOAL_OPTIONS: { value: InvestmentGoal; label: string }[] = [
  { value: "CAPITAL_GROWTH", label: "Capital Growth" },
  { value: "RENTAL_INCOME", label: "Rental Income" },
  { value: "BOTH", label: "Both" },
  { value: "RESIDENCY", label: "Residency / Citizenship" },
];

const DURATION_OPTIONS: { value: InvestmentDuration; label: string }[] = [
  { value: "SHORT", label: "Short term (1–3 years)" },
  { value: "MEDIUM", label: "Medium term (3–7 years)" },
  { value: "LONG", label: "Long term (7+ years)" },
];

const RISK_OPTIONS: { value: RiskLevel; label: string; desc: string }[] = [
  { value: "LOW", label: "Low Risk", desc: "Stable, lower returns" },
  { value: "MEDIUM", label: "Medium Risk", desc: "Balanced growth" },
  { value: "HIGH", label: "High Risk", desc: "Higher potential returns" },
];

const PROPERTY_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa / House" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
  { value: "MIXED", label: "No preference" },
];

const POPULAR_COUNTRIES = [
  "UAE", "Turkey", "Portugal", "Spain", "Greece",
  "Cyprus", "Georgia", "Malaysia", "Thailand", "Egypt",
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({
    countries: [],
  });

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  function next() {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
  }
  function back() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function set<K extends keyof AssessmentAnswers>(key: K, value: AssessmentAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      router.push(`/assessment/results?id=${data.id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Progress */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-amber-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <p className="text-slate-500 text-sm mb-2 text-center">
            Step {currentStep + 1} of {STEPS.length}
          </p>

          {/* Budget */}
          {step === "budget" && (
            <StepCard title="What is your investment budget?">
              <div className="space-y-3">
                {BUDGET_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={answers.budget === o.value}
                    onClick={() => { set("budget", o.value); next(); }}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* Goal */}
          {step === "goal" && (
            <StepCard title="What is your investment goal?">
              <div className="space-y-3">
                {GOAL_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={answers.goal === o.value}
                    onClick={() => { set("goal", o.value); next(); }}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* Rental Income */}
          {step === "rentalIncome" && (
            <StepCard title="Do you want rental income from your investment?">
              <div className="space-y-3">
                <OptionButton label="Yes" selected={answers.rentalIncome === true} onClick={() => { set("rentalIncome", true); next(); }} />
                <OptionButton label="No" selected={answers.rentalIncome === false} onClick={() => { set("rentalIncome", false); next(); }} />
              </div>
            </StepCard>
          )}

          {/* Duration */}
          {step === "duration" && (
            <StepCard title="How long do you plan to hold the investment?">
              <div className="space-y-3">
                {DURATION_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={answers.duration === o.value}
                    onClick={() => { set("duration", o.value); next(); }}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* Countries */}
          {step === "countries" && (
            <StepCard title="Which countries interest you?" subtitle="Select all that apply">
              <div className="flex flex-wrap gap-2 mb-6">
                {POPULAR_COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      const current = answers.countries ?? [];
                      set("countries", current.includes(c) ? current.filter((x) => x !== c) : [...current, c]);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      answers.countries?.includes(c)
                        ? "bg-amber-400 text-slate-900"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={next}
                disabled={!answers.countries?.length}
                className="w-full bg-amber-400 disabled:opacity-40 text-slate-900 font-semibold py-3 rounded-xl"
              >
                Continue
              </button>
            </StepCard>
          )}

          {/* Risk */}
          {step === "riskLevel" && (
            <StepCard title="What is your risk tolerance?">
              <div className="space-y-3">
                {RISK_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { set("riskLevel", o.value); next(); }}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                      answers.riskLevel === o.value
                        ? "border-amber-400 bg-amber-400/10 text-white"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <span className="font-semibold block">{o.label}</span>
                    <span className="text-sm opacity-70">{o.desc}</span>
                  </button>
                ))}
              </div>
            </StepCard>
          )}

          {/* Financing */}
          {step === "needsFinancing" && (
            <StepCard title="Do you need financing?">
              <div className="space-y-3">
                <OptionButton label="Yes, I need financing" selected={answers.needsFinancing === true} onClick={() => { set("needsFinancing", true); next(); }} />
                <OptionButton label="No, I will pay cash" selected={answers.needsFinancing === false} onClick={() => { set("needsFinancing", false); next(); }} />
              </div>
            </StepCard>
          )}

          {/* Property Type */}
          {step === "propertyType" && (
            <StepCard title="What type of property do you prefer?">
              <div className="space-y-3">
                {PROPERTY_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    label={o.label}
                    selected={answers.propertyType === o.value}
                    onClick={() => { set("propertyType", o.value); next(); }}
                  />
                ))}
              </div>
            </StepCard>
          )}

          {/* Residency */}
          {step === "residency" && (
            <StepCard title="Is obtaining residency important to you?">
              <div className="space-y-3">
                <OptionButton label="Yes, residency matters" selected={answers.residency === true} onClick={() => { set("residency", true); next(); }} />
                <OptionButton label="No, not important" selected={answers.residency === false} onClick={() => { set("residency", false); next(); }} />
              </div>
            </StepCard>
          )}

          {/* Contact */}
          {step === "contact" && (
            <StepCard title="Almost done!" subtitle="Optional — helps us send you your results">
              <div className="space-y-4 mb-6">
                {(["name", "email", "phone"] as const).map((field) => (
                  <input
                    key={field}
                    type={field === "email" ? "email" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field !== "name" && field !== "phone" ? "" : field === "phone" ? " (optional)" : "")}
                    value={(answers[field] as string) ?? ""}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                ))}
              </div>
              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold py-3 rounded-xl disabled:opacity-50"
              >
                {loading ? "Finding your matches..." : "See My Results →"}
              </button>
            </StepCard>
          )}

          {/* Back button */}
          {currentStep > 0 && (
            <button onClick={back} className="mt-6 text-slate-500 hover:text-slate-300 text-sm w-full text-center">
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm text-center mb-8">{subtitle}</p>}
      {!subtitle && <div className="mb-8" />}
      {children}
    </div>
  );
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-all font-medium ${
        selected
          ? "border-amber-400 bg-amber-400/10 text-white"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
