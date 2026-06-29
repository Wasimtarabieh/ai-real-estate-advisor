"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: "purpose",
    question: "هل العقار لك أو للاستثمار؟",
    options: [
      { value: "living",     label: "من أجل السكن",              icon: "🏠" },
      { value: "vacation",   label: "من أجل زيارته للتصييف",     icon: "🏖️" },
      { value: "investment", label: "من أجل الاستثمار",           icon: "📈" },
    ],
  },
  {
    id: "status",
    question: "هل تريد عقاراً؟",
    options: [
      { value: "off_plan",     label: "قيد الإنشاء",      icon: "🏗️" },
      { value: "ready",        label: "جاهز",              icon: "✅" },
      { value: "opportunity",  label: "حسب الفرصة",       icon: "🎯" },
    ],
  },
  {
    id: "type",
    question: "هل تريد عقاراً؟",
    options: [
      { value: "commercial",   label: "تجاري",             icon: "🏢" },
      { value: "touristic",    label: "سياحي",             icon: "🌴" },
      { value: "residential",  label: "سكني",              icon: "🏘️" },
      { value: "agricultural", label: "أرض زراعية",        icon: "🌾" },
      { value: "plot",         label: "أرض للعمار",        icon: "📐" },
      { value: "unsure",       label: "لست متأكداً",       icon: "🤔" },
    ],
  },
  {
    id: "priority",
    question: "هل يهمك أكثر؟",
    options: [
      { value: "rental",     label: "عائد إيجار شهري ثابت",       icon: "💵" },
      { value: "short_sale", label: "البيع بعد فترة قصيرة بربح", icon: "⚡" },
      { value: "long_sale",  label: "البيع بعد فترة بعيدة بربح", icon: "🌱" },
      { value: "both",       label: "يهمني الاثنين بنفس القدر",  icon: "⚖️" },
    ],
  },
  {
    id: "timeline",
    question: "متى تنوي إعادة البيع؟",
    options: [
      { value: "1y",      label: "خلال سنة",        icon: "📅" },
      { value: "3y",      label: "خلال 3 سنوات",    icon: "🗓️" },
      { value: "5y",      label: "خلال 5 سنوات",    icon: "📆" },
      { value: "unknown", label: "لا أعرف",          icon: "❓" },
    ],
  },
  {
    id: "budget",
    question: "ما هي ميزانيتك؟",
    options: [
      { value: "50k",      label: "حتى 50,000 يورو",          icon: "💶" },
      { value: "100k",     label: "حتى 100,000 يورو",         icon: "💶" },
      { value: "120k",     label: "حتى 120,000 يورو",         icon: "💶" },
      { value: "200k",     label: "حتى 200,000 يورو",         icon: "💶" },
      { value: "300k",     label: "حتى 300,000 يورو",         icon: "💶" },
      { value: "flexible", label: "يتعلق بالعقار",            icon: "🔄" },
    ],
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const progress = Math.round(((step) / STEPS.length) * 100);

  async function pick(value: string) {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnswers),
      });
      const data = await res.json();
      router.push(`/assessment/results?id=${data.id}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, #08081a 65%)" }}>
        <div className="w-14 h-14 rounded-full border-2 border-purple-500 border-t-pink-400 animate-spin mb-6" />
        <p className="gradient-text text-xl font-bold">نبحث عن أفضل الفرص لك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, #08081a 65%)" }}
      dir="rtl">

      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="gradient-text font-black text-xl">Ainvest</span>
            <span className="text-white/40 text-sm">
              {step + 1} / {STEPS.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #e040fb, #7c3aed)",
              }}
            />
          </div>

          {/* Stage dots */}
          <div className="flex gap-1.5 mt-3 justify-center">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? "24px" : "8px",
                  background: i < step
                    ? "linear-gradient(90deg,#e040fb,#7c3aed)"
                    : i === step
                    ? "linear-gradient(90deg,#e040fb,#7c3aed)"
                    : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            {current.question}
          </h2>

          <div className="grid gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => pick(opt.value)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-right transition-all duration-200 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(224,64,251,0.6)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(224,64,251,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(124,58,237,0.25)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-white font-medium text-base">{opt.label}</span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-6 w-full text-center text-white/30 hover:text-white/60 text-sm transition-colors"
            >
              ← رجوع
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
