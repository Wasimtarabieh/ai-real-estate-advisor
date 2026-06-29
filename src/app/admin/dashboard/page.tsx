export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projectCount, assessmentCount, bookingCount] = await Promise.all([
    prisma.project.count(),
    prisma.assessment.count(),
    prisma.booking.count(),
  ]);

  const [recentClients, recentProjects] = await Promise.all([
    prisma.assessment.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-1">Admin Panel — Real Estate Advisor</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="bg-amber-400 text-slate-900 font-semibold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-all"
          >
            + New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Projects", value: projectCount },
            { label: "Assessments", value: assessmentCount },
            { label: "Bookings", value: bookingCount },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">{s.label}</p>
              <p className="text-4xl font-bold text-amber-400">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Clients */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Recent Clients</h2>
              <Link href="/admin/clients" className="text-amber-400 text-sm">View all</Link>
            </div>
            {recentClients.length === 0 ? (
              <p className="text-slate-500 text-sm">No clients yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentClients.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c.name ?? c.email ?? "Anonymous"}</span>
                    <span className="text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Recent Projects</h2>
              <Link href="/admin/projects" className="text-amber-400 text-sm">View all</Link>
            </div>
            {recentProjects.length === 0 ? (
              <p className="text-slate-500 text-sm">No projects yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{p.name}</span>
                    <span className="text-slate-500">{p.country}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Nav links */}
        <div className="mt-10 flex gap-4 flex-wrap">
          {[
            { href: "/admin/projects", label: "Manage Projects" },
            { href: "/admin/clients", label: "View Clients" },
            { href: "/admin/bookings", label: "Bookings" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-5 py-2 rounded-full text-sm transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
