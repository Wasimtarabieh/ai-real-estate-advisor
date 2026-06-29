"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CHECK_GROUPS = [
  {
    label: "الغرض من العقار",
    items: [
      { key: "forLiving",     label: "للسكن" },
      { key: "forVacation",   label: "للتصييف" },
      { key: "forInvestment", label: "للاستثمار" },
    ],
  },
  {
    label: "حالة العقار",
    items: [
      { key: "offPlan", label: "قيد الإنشاء" },
      { key: "ready",   label: "جاهز" },
    ],
  },
  {
    label: "نوع العقار",
    items: [
      { key: "commercial",   label: "تجاري" },
      { key: "touristic",    label: "سياحي" },
      { key: "residential",  label: "سكني" },
      { key: "agricultural", label: "أرض زراعية" },
      { key: "buildingPlot", label: "أرض للعمار" },
    ],
  },
  {
    label: "الأولوية",
    items: [
      { key: "monthlyRental", label: "عائد إيجار شهري" },
      { key: "shortSale",     label: "بيع قصير الأمد" },
      { key: "longSale",      label: "بيع بعيد الأمد" },
    ],
  },
];

const BUDGET_OPTIONS = [
  { value: "50k",      label: "حتى 50,000 يورو" },
  { value: "100k",     label: "حتى 100,000 يورو" },
  { value: "120k",     label: "حتى 120,000 يورو" },
  { value: "200k",     label: "حتى 200,000 يورو" },
  { value: "300k",     label: "حتى 300,000 يورو" },
  { value: "flexible", label: "يتعلق بالعقار" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "", country: "", city: "", description: "",
    price: "", currency: "EUR",
    agentName: "", agentEmail: "", agentPhone: "",
    forLiving: false, forVacation: false, forInvestment: false,
    offPlan: false, ready: false,
    commercial: false, touristic: false, residential: false,
    agricultural: false, buildingPlot: false,
    monthlyRental: false, shortSale: false, longSale: false,
    budgets: [] as string[],
    isActive: true,
  });

  function setField(key: string, value: unknown) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function toggleBudget(v: string) {
    setForm((p) => ({
      ...p,
      budgets: p.budgets.includes(v) ? p.budgets.filter((b) => b !== v) : [...p.budgets, v],
    }));
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { urls } = await res.json();
    setImageUrls((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price) || 0,
        images: imageUrls,
        agentName: form.agentName || null,
        agentEmail: form.agentEmail || null,
        agentPhone: form.agentPhone || null,
        city: form.city || null,
      }),
    });
    router.push("/admin/projects");
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.3)" };

  return (
    <div className="min-h-screen px-4 py-10"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, #08081a 60%)" }}
      dir="rtl">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="gradient-text font-black text-2xl block">Ainvest</span>
            <h1 className="text-white font-bold text-xl mt-1">إضافة مشروع جديد</h1>
          </div>
          <a href="/admin/projects" className="text-white/40 hover:text-white text-sm">← المشاريع</a>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* Basic */}
          <Card title="المعلومات الأساسية">
            <Field label="اسم المشروع *">
              <input required className={inputCls} style={inputStyle} placeholder="مثال: Panorama Residences" value={form.name} onChange={(e) => setField("name", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="الدولة *">
                <input required className={inputCls} style={inputStyle} placeholder="تركيا" value={form.country} onChange={(e) => setField("country", e.target.value)} />
              </Field>
              <Field label="المدينة">
                <input className={inputCls} style={inputStyle} placeholder="إسطنبول" value={form.city} onChange={(e) => setField("city", e.target.value)} />
              </Field>
            </div>
            <Field label="وصف المشروع للزبون *">
              <textarea required rows={4} className={inputCls + " resize-none"} style={inputStyle} placeholder="اكتب وصفاً جذاباً للمشروع يظهر للزبون..." value={form.description} onChange={(e) => setField("description", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="السعر يبدأ من *">
                <input required type="number" className={inputCls} style={inputStyle} placeholder="85000" value={form.price} onChange={(e) => setField("price", e.target.value)} />
              </Field>
              <Field label="العملة">
                <select className={inputCls} style={inputStyle} value={form.currency} onChange={(e) => setField("currency", e.target.value)}>
                  <option value="EUR">يورو EUR</option>
                  <option value="USD">دولار USD</option>
                  <option value="GBP">إسترليني GBP</option>
                  <option value="AED">درهم AED</option>
                </select>
              </Field>
            </div>
          </Card>

          {/* Images */}
          <Card title="صور المشروع">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
              style={{ borderColor: "rgba(124,58,237,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e040fb")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")}
            >
              {uploading ? (
                <p className="text-white/50">جاري رفع الصور...</p>
              ) : (
                <>
                  <p className="text-4xl mb-2">📸</p>
                  <p className="text-white/60 text-sm">اضغط لرفع صور المشروع</p>
                  <p className="text-white/30 text-xs mt-1">PNG, JPG — يمكن رفع عدة صور</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && uploadImages(e.target.files)} />

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative h-24 rounded-xl overflow-hidden group">
                    <Image src={url} alt={`img-${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Matching checkboxes */}
          <Card title="قواعد المطابقة" subtitle="ضع ✓ لكل ما ينطبق على هذا المشروع">
            {CHECK_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.items.map((item) => {
                    const checked = form[item.key as keyof typeof form] as boolean;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setField(item.key, !checked)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: checked ? "linear-gradient(135deg,#e040fb,#7c3aed)" : "rgba(255,255,255,0.05)",
                          border: checked ? "1px solid transparent" : "1px solid rgba(124,58,237,0.3)",
                          color: checked ? "#fff" : "rgba(255,255,255,0.6)",
                        }}
                      >
                        {checked ? "✓" : "○"} {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">الميزانية المناسبة</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => toggleBudget(opt.value)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: form.budgets.includes(opt.value) ? "linear-gradient(135deg,#e040fb,#7c3aed)" : "rgba(255,255,255,0.05)",
                      border: form.budgets.includes(opt.value) ? "1px solid transparent" : "1px solid rgba(124,58,237,0.3)",
                      color: form.budgets.includes(opt.value) ? "#fff" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {form.budgets.includes(opt.value) ? "✓" : "○"} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Agent */}
          <Card title="معلومات الوكيل">
            <Field label="اسم الوكيل">
              <input className={inputCls} style={inputStyle} placeholder="أحمد محمد" value={form.agentName} onChange={(e) => setField("agentName", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="البريد الإلكتروني">
                <input type="email" className={inputCls} style={inputStyle} placeholder="agent@example.com" value={form.agentEmail} onChange={(e) => setField("agentEmail", e.target.value)} />
              </Field>
              <Field label="رقم الهاتف">
                <input className={inputCls} style={inputStyle} placeholder="+90 555 000 0000" value={form.agentPhone} onChange={(e) => setField("agentPhone", e.target.value)} />
              </Field>
            </div>
          </Card>

          {/* Active */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setField("isActive", !form.isActive)}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: form.isActive ? "linear-gradient(135deg,#e040fb,#7c3aed)" : "rgba(255,255,255,0.15)" }}
            >
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: form.isActive ? "calc(100% - 20px)" : "4px" }} />
            </button>
            <span className="text-white/60 text-sm">المشروع نشط ويظهر للزبائن</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ المشروع ✓"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card-dark p-6 space-y-4">
      <div>
        <h2 className="text-white font-bold text-base">{title}</h2>
        {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-white/50 text-xs">{label}</label>
      {children}
    </div>
  );
}
