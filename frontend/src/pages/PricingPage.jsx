import React, { useState } from "react";
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage({ onGetStarted }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "For solo creators and founders scaling organic distribution.",
      price: annual ? "$24" : "$29",
      period: "/ month",
      billing: annual ? "Billed annually ($288/yr)" : "Billed monthly",
      badge: null,
      highlight: false,
      features: [
        "1 Active Brand Memory Profile",
        "30 Repurposed Campaigns / mo",
        "All 7 Social & Written Platforms",
        "Text & PDF Document Uploads",
        "Brand Consistency Radar Scoring",
        "Standard Export (TXT & Copy)"
      ]
    },
    {
      name: "Pro Studio",
      desc: "For high-output creators, growth marketing teams, and agencies.",
      price: annual ? "$64" : "$79",
      period: "/ month",
      billing: annual ? "Billed annually ($768/yr)" : "Billed monthly",
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "5 Persistent Brand Memory Profiles",
        "Unlimited Repurposed Campaigns",
        "All 7 Platforms + Future Channels",
        "Audio & Video Ingestion (Speech-to-Text)",
        "AI 1-Click Auto-Fix & Modifiers",
        "Multi-Language Engine (Tamil, Spanish, etc.)",
        "Advanced Consistency Analytics",
        "Priority Gemini 1.5 Pro Processing"
      ]
    },
    {
      name: "Agency & Enterprise",
      desc: "For multi-client marketing agencies and enterprise brands.",
      price: annual ? "$159" : "$199",
      period: "/ month",
      billing: annual ? "Billed annually ($1,908/yr)" : "Billed monthly",
      badge: "UNLIMITED LEVERAGE",
      highlight: false,
      features: [
        "Unlimited Brand Memory Profiles",
        "Unlimited Audio/Video Transcripts",
        "Custom Brand Style Model Tuning",
        "Team Collaboration & Roles",
        "Dedicated API Webhooks Access",
        "99.9% Uptime SLA & Dedicated Manager",
        "Custom Vocabulary Rule Enforcers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Investment</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Supercharge Your Brand Reach for <span className="gradient-text">Less Than 1 Freelancer Post</span>.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Scale 10x content velocity without hiring a 10-person agency. All plans include persistent Brand Memory.
        </p>

        {/* Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!annual ? "text-white" : "text-slate-400"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-navy-800 border border-slate-700 p-1 flex items-center transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-brand-500 transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? "text-white" : "text-slate-400"}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-3xl border flex flex-col justify-between transition-all relative ${
              p.highlight
                ? "bg-gradient-to-b from-navy-850 via-navy-900 to-navy-950 border-brand-500 shadow-2xl shadow-brand-500/20 scale-105 z-10"
                : "bg-navy-900/80 border-slate-800 hover:border-slate-700 shadow-xl"
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-purple text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                {p.badge}
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{p.desc}</p>

              <div className="my-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">{p.period}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{p.billing}</div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  What's Included:
                </span>
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className={`mt-8 w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                p.highlight
                  ? "bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/25"
                  : "bg-navy-950 hover:bg-slate-800 text-slate-200 border border-slate-700"
              }`}
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How is BrandFlow AI different from ChatGPT or other wrappers?",
              a: "Standard LLMs suffer from prompt amnesia. Every time you chat, they forget your tone, vocabulary, and guidelines. BrandFlow AI stores a persistent Brand Memory profile that is programmatically merged into every prompt, scoring every output for 100% adherence."
            },
            {
              q: "Can I transcribe my podcasts and videos directly?",
              a: "Yes! Pro and Agency tiers support direct MP3, WAV, M4A, and MP4 video uploads. Our speech-to-text engine extracts the transcript automatically."
            },
            {
              q: "Does it support regional languages like Tamil?",
              a: "Yes! BrandFlow AI features native translation that preserves your brand tone and keyword weight across Tamil (தமிழ்), English, Spanish, French, German, and Hindi."
            }
          ].map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
