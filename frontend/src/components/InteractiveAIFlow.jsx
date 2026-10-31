import React, { useState } from "react";
import {
  FileText,
  Search,
  BrainCircuit,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Cpu,
  Zap
} from "lucide-react";

export default function InteractiveAIFlow() {
  const [activeStep, setActiveStep] = useState(2); // default on Brand Memory Engine

  const steps = [
    {
      id: 0,
      title: "ORIGINAL CONTENT",
      subtitle: "Ingestion Engine",
      icon: FileText,
      tag: "Input Stage",
      color: "from-blue-500 to-cyan-400",
      details: {
        heading: "Multi-Format Content Ingestion",
        description: "Ingests raw text, PDF documents, or audio/video files. Automatically runs speech-to-text transcription and extracts core narrative hooks.",
        metrics: ["Text, PDF, Audio & Video", "Automatic Whisper/Gemini Transcripts", "Hook & Thesis Extraction"]
      }
    },
    {
      id: 1,
      title: "AI CONTENT ANALYSIS",
      subtitle: "Semantic Parsing",
      icon: Search,
      tag: "Deconstruction",
      color: "from-cyan-400 to-indigo-500",
      details: {
        heading: "Semantic Architecture Breakdown",
        description: "Deconstructs the anchor content into underlying thesis statements, key supporting arguments, data metrics, and quotable insights.",
        metrics: ["Core Message Isolation", "Framework Structuring", "Information Density Audit"]
      }
    },
    {
      id: 2,
      title: "BRAND MEMORY ENGINE",
      subtitle: "Persistent DNA (The Moat)",
      icon: BrainCircuit,
      tag: "Signature Innovation",
      highlight: true,
      color: "from-brand-500 via-brand-purple to-pink-500",
      details: {
        heading: "Persistent Brand Memory Injection",
        description: "Retrieves your active Brand DNA. Automatically enforces your tone of voice, preferred keywords, and strictly filters out forbidden buzzwords.",
        metrics: ["Tone of Voice Guardrails", "Preferred Vocabulary Injection", "Forbidden Words Elimination", "Few-Shot Style Mimicking"]
      }
    },
    {
      id: 3,
      title: "PLATFORM OPTIMIZATION",
      subtitle: "Native Dialect Engine",
      icon: Layers,
      tag: "Channel Synthesis",
      color: "from-purple-500 to-pink-500",
      details: {
        heading: "Channel-Specific Algorithmic Dialects",
        description: "Translates the branded message into native platform structures: 0-3s retention hooks for Shorts, line-break leadership for LinkedIn, viral threads for X.",
        metrics: ["LinkedIn Thought Leadership", "Twitter/X Thread Velocity", "Instagram Carousel Hooks", "YouTube Shorts Visual Scripts"]
      }
    },
    {
      id: 4,
      title: "MULTIPLE CONTENT OUTPUTS",
      subtitle: "Omnipresent Reach",
      icon: Share2,
      tag: "Final Delivery",
      color: "from-pink-500 to-rose-400",
      details: {
        heading: "7 Verified Omnipresent Deliverables",
        description: "Outputs 7 publication-ready formats complete with real-time Brand Consistency scoring (0-100) and 1-click AI refinement controls.",
        metrics: ["7 Simultaneous Formats", "Brand Consistency Score out of 100", "1-Click AI Auto-Fix", "Multi-Language (Tamil & Global)"]
      }
    }
  ];

  const currentStep = steps[activeStep];

  return (
    <div className="w-full max-w-6xl mx-auto my-12 p-6 sm:p-10 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background glow ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300 mb-3">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          <span>Interactive AI Pipeline Architecture</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How One Piece of Content Compounds With Brand Memory
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Click any stage of the pipeline to inspect how our persistent memory engine ensures 100% brand fidelity.
        </p>
      </div>

      {/* Interactive Step Pipeline Nodes */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? "bg-navy-850 border-brand-500 shadow-xl shadow-brand-500/20 scale-105"
                  : "bg-navy-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Connector arrow line on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-brand-400 animate-pulse" : "text-slate-600"}`} />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-xl bg-gradient-to-tr ${s.color} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Step {idx + 1}
                  </span>
                </div>

                <div className="text-[11px] font-black tracking-tight text-white line-clamp-1">
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {s.subtitle}
                </div>
              </div>

              {s.highlight && (
                <div className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-brand-400" /> Active Moat
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage Detail Inspector Card */}
      <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
              {currentStep.tag}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Stage {activeStep + 1} of 5</span>
          </div>

          <h4 className="text-xl font-bold text-white tracking-tight">
            {currentStep.details.heading}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {currentStep.details.description}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="w-full md:w-auto shrink-0 space-y-2">
          {currentStep.details.metrics.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-850 border border-slate-800 text-xs font-semibold text-slate-200 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
