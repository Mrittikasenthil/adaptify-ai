import React from "react";
import {
  BrainCircuit,
  Share2,
  FileText,
  Mic,
  Video,
  ShieldCheck,
  Wand2,
  Globe,
  Zap,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";

export default function FeaturesPage({ onGetStarted }) {
  const featureList = [
    {
      title: "Persistent Brand Memory Vault",
      subtitle: "The Signature Innovation",
      icon: BrainCircuit,
      color: "from-brand-600 to-brand-purple",
      desc: "Save your brand personality, tone of voice, writing style, preferred vocabulary, and forbidden words. The AI maintains memory across sessions, ensuring every future output stays strictly on-brand without re-prompting.",
      highlights: ["Multiple Brand Profiles", "Forbidden Words Elimination", "Few-Shot Style Learning"]
    },
    {
      title: "Multimodal Speech & Video Ingestion",
      subtitle: "Podcast & Video Transcription",
      icon: Mic,
      color: "from-blue-600 to-cyan-500",
      desc: "Upload podcast MP3s, keynote videos, or webinar recordings. Our speech engine produces clean spoken transcripts ready for instantaneous transformation into social and written formats.",
      highlights: ["MP3, WAV, M4A Audio", "MP4, MOV, WebM Video", "Accurate Speaker Flow"]
    },
    {
      title: "Native 7-Platform Optimization",
      subtitle: "Channel-Specific Dialects",
      icon: Share2,
      color: "from-pink-600 to-purple-600",
      desc: "Translates the anchor insight into 7 platform-native structures: high-retention hooks for YouTube Shorts, thought leadership for LinkedIn, viral numbered threads for X, and conversion copy for Ads.",
      highlights: ["Instagram Carousels & Captions", "LinkedIn Thought Leadership", "YouTube Shorts Visual Scripts"]
    },
    {
      title: "Brand Consistency Radar",
      subtitle: "0-100 Quality Assurance",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-500",
      desc: "Every output is evaluated in real-time across 5 dimensions: tone alignment, writing cadence, vocabulary matching, audience suitability, and forbidden words compliance.",
      highlights: ["Real-time 0-100 Score", "1-Click AI Auto-Fix", "Actionable Improvement Suggestions"]
    },
    {
      title: "1-Click AI Studio Editor",
      subtitle: "Instant Style & Tone Modifiers",
      icon: Wand2,
      color: "from-violet-600 to-indigo-600",
      desc: "Refine outputs in one click: Shorten for brevity, Make More Professional, Shift to Casual, inject Urgent call-to-actions, or boost viral engagement hooks.",
      highlights: ["One-Click Shorten", "Tone Switching", "Viral Pattern Interrupts"]
    },
    {
      title: "Global Multi-Language Engine",
      subtitle: "Tamil, English & Global Locales",
      icon: Globe,
      color: "from-amber-500 to-rose-500",
      desc: "Repurpose your brand narrative globally. Preserves nuanced brand tone and keyword meaning across Tamil (தமிழ்), English, Spanish, French, German, and Hindi.",
      highlights: ["Tamil (தமிழ்) Localization", "Tone Preservation", "Cultural Dialect Nuance"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Feature Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Engineered for <span className="gradient-text">Omnipresent Reach</span> Without Brand Dilution.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore the end-to-end capabilities that turn one original content idea into 7 high-performing channel assets in seconds.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-navy-900 border border-slate-800 hover:border-brand-500/40 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className={`p-3 w-fit rounded-2xl bg-gradient-to-tr ${f.color} text-white shadow-lg mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                  {f.subtitle}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1.5">
                {f.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Bottom */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 border border-slate-800 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">Ready to Put These Features to Work?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Start creating in the studio right now with pre-seeded brand memories.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
        >
          Launch Studio Free
        </button>
      </div>
    </div>
  );
}
