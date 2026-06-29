"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function useTypewriter(text: string, speed = 45, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

export default function HomePage() {
  const slogan = useTypewriter("Where technology and real estate combined for best matching", 38, 800);
  const sub = useTypewriter(
    "استطلاع قصير ونعرض لك الفرص الاستثمارية المناسبة لك بالضبط",
    42,
    slogan.done ? 400 : 99999
  );

  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => {
    if (sub.done) setTimeout(() => setShowBtn(true), 500);
  }, [sub.done]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, #08081a 65%)" }}>

      {/* background glow orbs */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(224,64,251,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="max-w-3xl mx-auto z-10">

        {/* Logo */}
        <div className="mb-10 fade-up">
          <span className="text-5xl md:text-6xl font-black tracking-tight gradient-text">
            Ainvest
          </span>
          <span className="block text-xs text-purple-400 tracking-[0.3em] uppercase mt-1 opacity-70">
            by AI Real Estate
          </span>
        </div>

        {/* Slogan typewriter */}
        <h1 className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed mb-2 min-h-[3rem]">
          {slogan.displayed}
          {!slogan.done && <span className="cursor-blink" />}
        </h1>

        {/* Sub typewriter */}
        {slogan.done && (
          <p className="text-base md:text-lg text-purple-300 min-h-[2rem] mt-4 mb-10"
            dir="rtl">
            {sub.displayed}
            {!sub.done && <span className="cursor-blink" />}
          </p>
        )}

        {/* CTA Button */}
        {showBtn && (
          <div className="fade-up">
            <Link
              href="/assessment"
              className="gradient-btn inline-block text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-purple-900/40"
            >
              ابدأ الاستطلاع المجاني →
            </Link>
            <p className="text-white/30 text-xs mt-4">أقل من 2 دقيقة · مجاني تماماً</p>
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #08081a, transparent)" }} />
    </main>
  );
}
