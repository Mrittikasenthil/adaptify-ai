import React, { useState } from "react";
import {
  X,
  Sparkles,
  BrainCircuit,
  FileText,
  Share2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Play
} from "lucide-react";

export default function ProductTourModal({ isOpen, onClose, onStartDemo }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: "Welcome to BrandFlow AI",
      tagline: "The First Content Repurposing Studio with Persistent Brand Memory",
      icon: Zap,
      color: "from-brand-600 to-brand-purple",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Most AI tools suffer from <strong className="text-white">context amnesia</strong>: they forget who you are every time you start a new prompt, forcing you to re-explain your brand or settle for robotic, generic outputs.
          </p>
          <div className="p-3.5 rounded-xl bg-navy-950/80 border border-brand-500/30">
            <span className="text-brand-300 font-bold block mb-1">💡 The BrandFlow Innovation:</span>
            BrandFlow AI remembers your brand identity, tone of voice, forbidden words, and guidelines across sessions, injecting them automatically into every generated asset.
          </div>
        </div>
      )
    },
    {
      title: "1. The Brand Memory Vault",
      tagline: "Your Brand's Persistent Creative DNA",
      icon: BrainCircuit,
      color: "from-purple-500 to-indigo-500",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Configure your brand once in the <strong className="text-white">Brand Memory Vault</strong>:
          </p>
          <ul className="space-y-1.5 pl-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Personality & Tone:</strong> Authoritative, Casual, Witty, or Urgent</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Preferred Vocabulary:</strong> Keywords woven into every post</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span><strong>Forbidden Buzzwords:</strong> Strictly detected and eliminated</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span><strong>Sample Content:</strong> Few-shot style learning demonstrations</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "2. Content Ingestion & Transcription",
      tagline: "Text, PDF, Audio & Video Support",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Drop any masterclass content into the studio:
          </p>
          <div className="grid grid-cols-2 gap-2 text-slate-200">
            <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800">
              <span className="font-bold text-white block">📄 Documents</span>
              <span className="text-[11px] text-slate-400">PDF & text parsing</span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800">
              <span className="font-bold text-white block">🎙️ Audio & Video</span>
              <span className="text-[11px] text-slate-400">Instant speech transcripts</span>
            </div>
          </div>
          <p>
            You can review and polish the extracted transcript before triggering multi-channel repurposing.
          </p>
        </div>
      )
    },
    {
      title: "3. 7-Platform Repurposing Engine",
      tagline: "Native Channel Dialects, Zero Brand Drift",
      icon: Share2,
      color: "from-pink-500 to-rose-500",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            One click generates publication-ready assets for:
          </p>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">LinkedIn</span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">Twitter / X</span>
            <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 font-bold">Instagram</span>
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 font-bold">YouTube Shorts</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">SEO Blog</span>
            <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold">Newsletter</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">Promotional Ad</span>
          </div>
          <p>
            Each format respects native algorithms: 0-3s retention hooks for video, clean spacing for LinkedIn, and viral threads for Twitter.
          </p>
        </div>
      )
    },
    {
      title: "4. Brand Consistency Radar & Auto-Fix",
      tagline: "Real-Time Quality Assurance (0-100 Score)",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Every single generated asset is automatically audited against your Brand Memory profile.
          </p>
          <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Brand Consistency Score</span>
              <span className="text-[10px] text-slate-400">Tone, Vocabulary, Style & Audience Match</span>
            </div>
            <span className="text-xl font-black text-emerald-400">96 / 100</span>
          </div>
          <p>
            Found an inconsistency? Use the <strong className="text-white">1-Click AI Auto-Fix</strong> to replace non-compliant terms in one second!
          </p>
        </div>
      )
    }
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-navy-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-8 bg-brand-500" : "w-2 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Step Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${step.color} text-white shadow-lg`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
              <p className="text-xs text-brand-300 font-medium">{step.tagline}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[160px] py-2">
          {step.content}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentStep < tourSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(tourSteps.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onStartDemo) onStartDemo();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Live Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
