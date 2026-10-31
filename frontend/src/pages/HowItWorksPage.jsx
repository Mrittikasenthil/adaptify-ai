import React from "react";
import InteractiveAIFlow from "../components/InteractiveAIFlow";
import { BrainCircuit, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function HowItWorksPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
          <Zap className="w-3.5 h-3.5" />
          <span>Interactive Architectural Walkthrough</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          How <span className="gradient-text">BrandFlow AI</span> Multiplies Your Content.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          See exactly how a single video, podcast, or article flows through our Brand Memory pipeline to yield 7 publication-ready native posts.
        </p>
      </div>

      {/* Interactive Flow Visualizer */}
      <InteractiveAIFlow />

      {/* 3 Step Deep Dive */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">The Three-Step Creator Workflow</h2>
          <p className="text-xs text-slate-400 mt-1">From raw notes to omnipresent distribution in under 60 seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "Phase 01",
              title: "Define Brand DNA Once",
              desc: "Input your brand guidelines, preferred keywords, and words to avoid. BrandFlow AI persistently stores this in the database.",
              bullets: ["Tone of voice matrix", "Forbidden words filter", "Multi-brand profile switching"]
            },
            {
              step: "Phase 02",
              title: "Drop In Any Content Asset",
              desc: "Paste notes or upload PDFs, audio files, or videos. Our transcription service extracts the core thesis and spoken transcript.",
              bullets: ["Speech-to-text transcription", "PDF document extraction", "Source text editor & review"]
            },
            {
              step: "Phase 03",
              title: "Repurpose & Quality Audit",
              desc: "Click 'Generate All Formats'. Receive 7 native channel assets with instant Brand Consistency scoring and 1-click Auto-Fix.",
              bullets: ["7 native platform outputs", "0-100 Brand Consistency Radar", "1-Click AI editing & translation"]
            }
          ].map((phase, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-400 block">
                {phase.step}
              </span>
              <h3 className="text-base font-bold text-white">{phase.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{phase.desc}</p>
              <div className="pt-3 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                {phase.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-brand-950 via-navy-900 to-navy-950 border border-brand-500/30 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">Experience the Pipeline Firsthand</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Open the Content Repurposing Studio to test your own content against the Brand Memory engine.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Content Studio</span>
        </button>
      </div>
    </div>
  );
}
