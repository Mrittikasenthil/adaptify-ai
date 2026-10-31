import React, { useState } from "react";
import {
  Award,
  Sparkles,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api";

export default function PracticeQuizPage({
  materials = [],
  selectedMaterial,
  onOpenQuizModal
}) {
  const [selectedTopic, setSelectedTopic] = useState(selectedMaterial?.title || "Operating Systems: CPU Scheduling & Deadlocks");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("timed"); // "timed" | "untimed"

  const topicsList = [
    { id: "sample-os-1", title: "Operating Systems: CPU Scheduling & Deadlocks", count: "8 Questions", subject: "Operating Systems" },
    { id: "sample-physics-1", title: "Engineering Physics: Quantum Wave Mechanics", count: "10 Questions", subject: "Engineering Physics" },
    { id: "sample-dsa-1", title: "Data Structures: AVL Trees & Graphs", count: "12 Questions", subject: "Data Structures" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Smart Assessment Engine
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Practice & Adaptive Examination Quizzes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate your knowledge. Every question you answer dynamically tunes your personalized learner model.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 8 Quiz Sessions Completed
          </span>
        </div>
      </div>

      {/* Quiz Launcher Card */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            1. Select Syllabus Topic to Practice
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topicsList.map((t) => {
              const isSelected = selectedTopic === t.title;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t.title)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-purple-50 border-purple-600 shadow-xs"
                      : "bg-[#FAF9FF] hover:bg-purple-50/40 border-purple-100 text-slate-700"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                      {t.subject}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                      {t.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {t.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-purple-100">
          
          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              2. Target Difficulty Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    difficulty === lvl
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              3. Assessment Mode:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("timed")}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  mode === "timed"
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Timed (5 mins)
              </button>

              <button
                onClick={() => setMode("untimed")}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  mode === "untimed"
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
                }`}
              >
                Untimed Practice
              </button>
            </div>
          </div>

        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={() => onOpenQuizModal("sample-quiz", selectedTopic)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
          >
            <Award className="w-4 h-4" /> Start Adaptive Quiz for {selectedTopic}
          </button>
        </div>

      </div>

      {/* Past Quiz History Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800">
          Recent Assessment Performance
        </h3>

        <div className="space-y-3">
          {[
            { topic: "CPU Scheduling Algorithms (Round Robin vs SJF)", score: "4 / 4", pct: 100, date: "Yesterday, 4:20 PM", badge: "Perfect Score" },
            { topic: "AVL Tree Rotations & Balance Factors", score: "3 / 4", pct: 75, date: "2 days ago", badge: "Strong" },
            { topic: "Quantum Tunneling & Potential Barriers", score: "2 / 4", pct: 50, date: "3 days ago", badge: "Needs Practice" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-purple-50/20 border border-purple-100/70 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-bold text-slate-800">{item.topic}</h4>
                <p className="text-[11px] text-slate-400">{item.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-900">{item.score} ({item.pct}%)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.pct >= 80 ? "bg-emerald-100 text-emerald-800" : item.pct >= 60 ? "bg-indigo-100 text-indigo-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
