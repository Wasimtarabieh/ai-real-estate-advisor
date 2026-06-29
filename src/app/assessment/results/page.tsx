"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface ResultProject {
  score: number;
  project: {
    id: string;
    name: string;
    country: string;
    city: string;
    description: string;
    minInvestment: number;
    expectedReturn: number;
    riskLevel: string;
    propertyType: string;
    residency: boolean;
  };
}

function ResultsContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [results, setResults] = useState<ResultProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessments/${id}/results`)
      .then((r) => r.json())
      .then((data) => { setResults(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Finding your best matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm uppercase tracking-widest mb-3">Your Results</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            {results.length > 0 ? `We found ${results.length} matches for you` : "No matches found"}
          </h1>
          <p className="text-slate-400">
            {results.length > 0
              ? "Here are the best investment opportunities based on your profile"
              : "Try adjusting your preferences to find more opportunities"}
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {results.map(({ project, score }, i) => (
            <div key={project.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider">#{i + 1} Match</span>
                  <h2 className="text-xl font-bold text-white mt-1">{project.name}</h2>
                  <p className="text-slate-400 text-sm">{project.city}, {project.country}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-400">{Math.round(score)}%</span>
                  <p className="text-slate-500 text-xs">match score</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Stat label="Min. Investment" value={`$${project.minInvestment.toLocaleString()}`} />
                <Stat label="Expected Return" value={`${project.expectedReturn}%/yr`} />
                <Stat label="Risk Level" value={project.riskLevel} />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Tag label={project.propertyType} />
                {project.residency && <Tag label="Residency" highlight />}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Book a Free Consultation</h3>
          <p className="text-slate-400 text-sm mb-6">
            Speak with an investment specialist to discuss your options in detail.
          </p>
          <Link
            href={`/assessment/book?id=${id}`}
            className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-3 rounded-full transition-all"
          >
            Book Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-xl p-3 text-center">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  );
}

function Tag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${highlight ? "bg-amber-400/20 text-amber-400" : "bg-slate-700 text-slate-300"}`}>
      {label}
    </span>
  );
}
