import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-6">
            AI Real Estate Investment Advisor
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Find the Best Real Estate
            <span className="text-amber-400"> Investment</span> for You
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Answer a few questions and get personalized investment opportunities
            matched to your goals, budget, and risk appetite.
          </p>
          <Link
            href="/assessment"
            className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-amber-400/30"
          >
            Start Free Assessment
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-500 mb-16">Three simple steps to your perfect investment</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Answer a few questions",
                desc: "Tell us your budget, goals, and preferences in under 5 minutes.",
              },
              {
                step: "02",
                title: "Get personalized recommendations",
                desc: "Our engine matches you with the best investment opportunities.",
              },
              {
                step: "03",
                title: "Book a consultation",
                desc: "Speak with a specialist to finalize your investment decision.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <span className="text-6xl font-bold text-amber-400/20 mb-4">{item.step}</span>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
          <p className="text-slate-500 mb-16">We help you invest smarter, not harder</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Global Opportunities", desc: "Access curated projects across multiple countries." },
              { title: "Smart Matching", desc: "Rule-based engine that finds your perfect fit." },
              { title: "No Broker Pressure", desc: "Get unbiased recommendations based on your profile." },
              { title: "Residency Options", desc: "Explore investments that come with residency benefits." },
              { title: "Flexible Budgets", desc: "Opportunities starting from $50K and above." },
              { title: "Expert Consultation", desc: "Book a free call with an investment specialist." },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-left"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: "Is the assessment really free?", a: "Yes, 100% free with no obligations." },
              {
                q: "Do I need to create an account?",
                a: "No account needed. Just answer the questions and get your results instantly.",
              },
              {
                q: "How accurate are the recommendations?",
                a: "Our matching engine uses detailed criteria to ensure highly relevant results based on your specific profile.",
              },
              {
                q: "Can I invest from any country?",
                a: "Yes. We work with international investors from all over the world.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-slate-100 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to find your investment?</h2>
        <p className="text-slate-400 mb-8">Takes less than 5 minutes.</p>
        <Link
          href="/assessment"
          className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-10 py-4 rounded-full text-lg transition-all duration-200"
        >
          Start Free Assessment
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} AI Real Estate Investment Advisor. All rights reserved.
      </footer>
    </main>
  );
}
