import React from "react";
import {
  BrainCircuit,
  Sparkles,
  Zap,
  ShieldCheck,
  Target,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function AboutPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Our Mission & Architectural Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Eliminating <span className="gradient-text">Context Amnesia</span> from AI Content Creation.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Generic AI generators treat your business like a stranger with every new prompt. BrandFlow AI was engineered to give modern founders, creators, and growth teams a persistent creative memory.
        </p>
      </div>

      {/* The Problem vs Solution Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-navy-900/60 border border-rose-500/20 shadow-xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            ✕ The Industry Problem
          </span>
          <h3 className="text-xl font-bold text-white">The Content Treadmill & Brand Drift</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Marketing teams spend 10+ hours creating a high-depth podcast, webinar, or keynote. When attempting to repurpose it with standard ChatGPT or generic tools, two things happen:
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Generic Robotic Fluff:</strong> Outputs rely on worn-out buzzwords like "delve into" and "game changer".</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Diluted Tone:</strong> The Twitter output sounds casual, the LinkedIn post sounds bureaucratic, and customer trust erodes.</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-navy-900/60 border border-brand-500/30 shadow-xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            ✓ The BrandFlow Solution
          </span>
          <h3 className="text-xl font-bold text-white">The Persistent Brand Memory Engine</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            By encoding your tone of voice, preferred vocabulary, forbidden buzzwords, and few-shot examples into persistent AI memory, BrandFlow AI acts as your dedicated brand ghostwriter:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>100% Brand Consistency:</strong> Automated 0-100 radar scoring against guidelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
              <span><strong>7 Native Channels in 1 Click:</strong> True dialect translation for LinkedIn, Twitter, Shorts, & Newsletters.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Our Product Principles</h2>
          <p className="text-xs text-slate-400 mt-1">What guides every architecture and design decision.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Voice is a Moat",
              desc: "In an era of infinite generic AI content, your brand's unique point of view, tone, and vocabulary is your only sustainable organic moat.",
              icon: ShieldCheck
            },
            {
              title: "Speed Without Dilution",
              desc: "Velocity is useless if the outputs sound like a generic brochure. We optimize for compounding speed while preserving voice integrity.",
              icon: Zap
            },
            {
              title: "Channel-Native Mastery",
              desc: "Never copy-paste. Respect the cultural format of every platform: 0-3s hooks for Shorts, line-breaks for LinkedIn, punchy threads for X.",
              icon: Target
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-md">
                <div className="p-2.5 w-fit rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-brand-950 via-navy-900 to-navy-950 border border-brand-500/30 text-center space-y-4 shadow-2xl">
        <h3 className="text-2xl font-black text-white">Experience Content Repurposing with Memory</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Join thousands of founders and creators building multi-channel omnipresence without brand fatigue.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch BrandFlow Studio</span>
        </button>
      </div>
    </div>
  );
}
