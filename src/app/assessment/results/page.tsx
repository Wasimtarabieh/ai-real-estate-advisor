"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  country: string;
  city?: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
}

interface LeadForm {
  name: string;
  email: string;
  phone: string;
}

function ResultsContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadProject, setLeadProject] = useState<Project | null>(null);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/assessments/${id}/results`)
      .then((r) => r.json())
      .then((data: Project[]) => { setProjects(data); setLoading(false); });
  }, [id]);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, assessmentId: id, projectId: leadProject?.id }),
    });
    setSent(true);
    setSending(false);
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
    <div className="min-h-screen px-4 py-12"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, #08081a 65%)" }}
      dir="rtl">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="gradient-text font-black text-2xl block mb-4">Ainvest</span>
          {projects.length > 0 ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                وجدنا هذه المشاريع المناسبة لك{" "}
                <span className="gradient-text">شخصياً</span>
              </h1>
              <p className="text-white/50 text-base">
                {projects.length} {projects.length === 1 ? "مشروع" : "مشاريع"} مختارة بناءً على إجاباتك
              </p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-white">لم نجد مشاريع مناسبة حالياً</h1>
          )}
        </div>

        {/* Projects grid */}
        {projects.length > 0 && (
          <div className={`grid gap-6 ${projects.length === 1 ? "max-w-sm mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {projects.map((project) => (
              <div key={project.id} className="card-dark overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-52 bg-white/5">
                  {project.images?.[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🏢</div>
                  )}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(8,8,26,0.8) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ background: "linear-gradient(135deg,#e040fb,#7c3aed)" }}>
                      {project.country}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">{project.name}</h2>
                  {project.city && (
                    <p className="text-white/40 text-sm mb-3">📍 {project.city}، {project.country}</p>
                  )}
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4 py-3 px-4 rounded-xl" style={{ background: "rgba(224,64,251,0.08)", border: "1px solid rgba(224,64,251,0.2)" }}>
                    <p className="text-white/50 text-xs mb-0.5">السعر يبدأ من</p>
                    <p className="gradient-text font-bold text-xl">
                      {project.price.toLocaleString()} {project.currency}
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setLeadProject(project)}
                    className="gradient-btn w-full py-3 rounded-xl text-white font-bold text-sm mt-auto"
                  >
                    تواصل مع الوكيل الخاص بالمشروع
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a href="/" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            ← ابدأ استطلاعاً جديداً
          </a>
        </div>
      </div>

      {/* Lead Modal */}
      {leadProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="card-dark w-full max-w-md p-8 relative" dir="rtl">
            <button
              onClick={() => { setLeadProject(null); setSent(false); }}
              className="absolute top-4 left-4 text-white/40 hover:text-white text-xl"
            >✕</button>

            {sent ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-white/50 text-sm">سيتواصل معك الوكيل قريباً.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">تواصل مع الوكيل</h3>
                <p className="text-white/50 text-sm mb-6">{leadProject.name}</p>
                <form onSubmit={submitLead} className="space-y-4">
                  <input
                    required
                    placeholder="اسمك الكريم"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
                  />
                  <input
                    required
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
                  />
                  <input
                    placeholder="رقم الهاتف (اختياري)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="gradient-btn w-full py-3 rounded-xl text-white font-bold disabled:opacity-50"
                  >
                    {sending ? "جاري الإرسال..." : "أرسل بياناتي للوكيل →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return <Suspense><ResultsContent /></Suspense>;
}
