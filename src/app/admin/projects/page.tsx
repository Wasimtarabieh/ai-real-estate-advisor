export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen px-4 py-10"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, #08081a 60%)" }}
      dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="gradient-text font-black text-2xl block">Ainvest</span>
            <h1 className="text-white font-bold text-xl mt-1">إدارة المشاريع</h1>
          </div>
          <Link href="/admin/projects/new"
            className="gradient-btn px-5 py-2.5 rounded-full text-white font-bold text-sm">
            + مشروع جديد
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <p className="text-5xl mb-4">🏢</p>
            <p className="text-white/50">لا توجد مشاريع بعد</p>
            <Link href="/admin/projects/new"
              className="gradient-btn inline-block mt-4 px-6 py-2 rounded-full text-white text-sm font-bold">
              أضف أول مشروع
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div key={p.id} className="card-dark overflow-hidden flex flex-col">
                <div className="relative h-40 bg-white/5">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🏢</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.isActive ? "نشط" : "مخفي"}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-bold mb-0.5">{p.name}</h3>
                  <p className="text-white/40 text-xs mb-3">📍 {p.city ? `${p.city}، ` : ""}{p.country}</p>
                  <p className="gradient-text font-bold text-sm mb-3">
                    {p.price.toLocaleString()} {p.currency}
                  </p>
                  <Link href={`/admin/projects/${p.id}/edit`}
                    className="mt-auto text-center text-white/50 hover:text-white text-xs border border-white/10 hover:border-white/30 rounded-lg py-2 transition-all">
                    تعديل المشروع
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link href="/admin/dashboard" className="text-white/30 hover:text-white text-sm transition-colors">← لوحة التحكم</Link>
        </div>
      </div>
    </div>
  );
}
