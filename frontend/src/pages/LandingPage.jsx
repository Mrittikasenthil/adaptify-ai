import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Zap,
  Brain,
  FileText,
  Target,
  ArrowRight,
  Mic,
  CheckCircle2,
  Play,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Compass
} from "lucide-react";
import AITutorRobot from "../components/AITutorRobot";

export default function LandingPage({
  onGetStarted,
  onOpenVoiceModal,
  onOpenAuth
}) {
  const [demoTopic, setDemoTopic] = useState("quantum");

  const topics = {
    quantum: {
      name: "Engineering Physics",
      title: "Quantum Wave Mechanics & Tunneling",
      snippet: "λ = h / p relates matter momentum to wave propagation. Tunneling allows particles to cross barriers V₀ > E."
    },
    os: {
      name: "Operating Systems",
      title: "CPU Scheduling & Banker's Algorithm",
      snippet: "Round Robin balances interactive latency via time quantum q. Banker's algorithm checks safety state: Need ≤ Available."
    },
    dsa: {
      name: "Data Structures",
      title: "AVL Trees & Dijkstra's Algorithm",
      snippet: "Balance Factor BF ∈ {-1, 0, +1} maintains strict O(log n) tree height. Dijkstra uses min-heaps in O((V+E) log V)."
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-20 px-6 sm:px-12 border-b border-purple-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-[2px] shadow-md shadow-purple-500/25">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              ADAPTIFY<span className="text-purple-600">.AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold uppercase tracking-wider">
              Exam Tutor
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-600 transition-colors">How It Works</a>
          <a href="#adaptive" className="hover:text-purple-600 transition-colors">Adaptive AI</a>
          <a href="#stats" className="hover:text-purple-600 transition-colors">Results</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVoiceModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200/70"
          >
            <Mic className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            Wispr Voice
          </button>

          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            Launch Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 sm:px-12 pt-16 pb-24 overflow-hidden bg-mesh-lavender">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 shadow-xs text-xs font-bold text-purple-700">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>An AI Tutor That Adapts to HOW You Learn</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Learn Faster. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                Understand Better.
              </span> <br />
              Achieve More.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Most platforms teach every student the same way. <strong>ADAPTIFY AI</strong> transforms lecture videos, PPTs and PDFs into personalized study notes, tracks weak concepts, and speaks with you in English, Tamil, or Tanglish using Wispr Flow voice dictation.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-purple-500/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Upload Study Material Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoiceModal}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-purple-50/60 border border-purple-200 text-purple-800 font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
              >
                <Mic className="w-4 h-4 text-purple-600 animate-pulse" />
                <span>Talk to AI Tutor</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF, PPT, Video & Images</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Wispr Flow Compatible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tamil & Tanglish Supported</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: 3D Robot + Interactive Study Card */}
          <div className="flex-1 w-full max-w-lg relative">
            <div className="p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl relative space-y-5">
              
              {/* Robot Avatar Showcase */}
              <div className="flex items-center justify-center py-2">
                <AITutorRobot size="lg" onClick={onOpenVoiceModal} />
              </div>

              {/* Sample Topic Switcher */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-purple-700">
                    Live Study Preview:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Exam-Ready
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {Object.keys(topics).map((key) => (
                    <button
                      key={key}
                      onClick={() => setDemoTopic(key)}
                      className={`text-[10px] px-2.5 py-1 rounded-xl font-bold transition-all ${
                        demoTopic === key
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-purple-100/60 border border-purple-100"
                      }`}
                    >
                      {topics[key].name}
                    </button>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {topics[demoTopic].title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {topics[demoTopic].snippet}
                  </p>
                </div>
              </div>

              {/* Action trigger */}
              <button
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Explore Full 12-Part Notes & Practice Quiz</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 3. 4 CORE CAPABILITIES */}
      <section id="features" className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
              Transform Your Learning
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Ace Your Exams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four pillars designed to take you from initial confusion to complete exam mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "1. Saves Time",
                desc: "Convert lengthy 2-hour video lectures, 80-page PDFs and 100-slide PPTs into crisp, high-yield study notes in seconds.",
                badge: "10x Faster"
              },
              {
                icon: Brain,
                title: "2. Improves Understanding",
                desc: "Get crystal-clear analogical explanations, step-by-step mathematical derivations, and ASCII/SVG architecture diagrams.",
                badge: "Deep Clarity"
              },
              {
                icon: FileText,
                title: "3. Smart Summaries",
                desc: "12 structured components: Summaries, Key Definitions, Formulas, 2/5/16-Mark Answers, and Last-Minute Cram Sheets.",
                badge: "Exam Format"
              },
              {
                icon: Target,
                title: "4. Personalized Learning",
                desc: "The AI tracks your mistakes in quizzes, identifies weak concepts, and automatically adjusts explanation complexity.",
                badge: "Adaptive AI"
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm hover:border-purple-300 card-hover-glow transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 w-fit">
                    {card.badge}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ANIMATED WORKFLOW: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
              The 4-Step Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Complex Raw File to Exam-Ready Mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Analyze Content",
                desc: "Upload videos, PPTs, textbook PDFs or paste YouTube links. The multimodal parser extracts formulas, text & diagrams."
              },
              {
                step: "02",
                title: "Extract Key Points",
                desc: "Core definitions, formulas and principles are isolated and prioritized by syllabus importance."
              },
              {
                step: "03",
                title: "Generate Smart Notes",
                desc: "Synthesizes 2-mark definitions, 5-mark conceptual answers, 16-mark essays, and visual diagrams."
              },
              {
                step: "04",
                title: "Personalized Learning",
                desc: "Take adaptive MCQs. If you struggle with a topic, the AI dynamically simplifies explanations and schedules revision."
              }
            ].map((w, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-3 relative group hover:border-purple-300 transition-all"
              >
                <span className="text-2xl font-black text-purple-200 group-hover:text-purple-600 transition-colors">
                  {w.step}
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  {w.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ADAPTIVE LEARNING EXPLANATION */}
      <section id="adaptive" className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
              Adaptive Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              "An AI tutor that doesn't teach every student the same way."
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When students get stuck on concepts like <em>Banker's Algorithm</em> or <em>Quantum Wave Derivations</em>, standard textbooks just repeat the exact same sentence.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>ADAPTIFY AI</strong> detects repeated errors, lowers the cognitive hurdle using everyday analogies, generates gentle step-by-step practice questions, and gradually raises the difficulty back to university exam-standard.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              {[
                "Continuously updates Student Mastery Model",
                "Highlights weak concepts with 1-click targeted cram sheets",
                "Supports English, Tamil, and Tanglish spoken responses",
                "Wispr Flow dictation into any text area on your device"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Live Learner Model State:
            </h3>

            {[
              { topic: "CPU Scheduling Algorithms", score: 92, status: "Strong", color: "bg-emerald-500" },
              { topic: "AVL Tree Rotations", score: 88, status: "Strong", color: "bg-emerald-500" },
              { topic: "Dijkstra Priority Queues", score: 76, status: "Improving", color: "bg-indigo-500" },
              { topic: "Deadlocks & Banker's Algorithm", score: 68, status: "Needs Practice", color: "bg-amber-500" },
              { topic: "Quantum Tunneling Barriers", score: 58, status: "Needs Practice", color: "bg-rose-500" }
            ].map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{t.topic}</span>
                  <span>{t.score}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-slate-200/50">
                  <div className={`${t.color} h-full transition-all`} style={{ width: `${t.score}%` }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. STATISTICS & IMPACT */}
      <section id="stats" className="py-16 px-6 sm:px-12 bg-[#FAF8FF] border-y border-purple-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-purple-700">94%</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Average Exam Score</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-indigo-700">10x</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Faster Study Speed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-blue-700">45k+</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Questions Practiced</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-700">100%</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Wispr Flow Ready</p>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 px-6 sm:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ready to Study with Your Personal AI Tutor?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload your first video, PDF or PPT and experience the power of adaptive learning with Wispr Flow voice interaction.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-purple-500/30 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenVoiceModal}
              className="px-6 py-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Mic className="w-4 h-4 text-purple-600" />
              <span>Talk to ADAPTIFY AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-8 px-6 sm:px-12 bg-white border-t border-purple-100 text-center text-xs text-slate-400">
        <p>© 2026 ADAPTIFY AI — Adaptive Exam-Preparation & Personal Learning Platform. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-purple-600 font-medium">Built for High-Velocity Exam Preparation with Wispr Flow Voice Integration.</p>
      </footer>

    </div>
  );
}
