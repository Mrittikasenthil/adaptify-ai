import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Flame,
  HelpCircle,
  RefreshCw,
  Sliders
} from "lucide-react";
import { api } from "../services/api";

export default function AdaptiveLearningPage({
  onOpenQuizModal,
  onNavigateNotes
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const p = await api.getProgress();
        setProfile(p);
      } catch (e) {
        console.warn("Progress load error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Strong") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "Improving") return "bg-indigo-100 text-indigo-800 border-indigo-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  const getBarColor = (status) => {
    if (status === "Strong") return "bg-emerald-500";
    if (status === "Improving") return "bg-indigo-500";
    return "bg-rose-500";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Personalized Learner Model
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Adaptive Learning & Topic Mastery Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cognitive profile tracking understanding, weak concepts, and study trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>7 Day Streak</span>
          </div>

          <button
            onClick={() => onOpenQuizModal("sample-os-1", "Deadlock Avoidance & Banker's Algorithm")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" /> Assess Weak Topic
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Overall Comprehension",
            val: `${profile?.overall_comprehension || 84}%`,
            sub: "Top 8% in Cohort",
            color: "text-purple-600 bg-purple-50"
          },
          {
            label: "Exam Readiness",
            val: `${profile?.exam_readiness || 89}%`,
            sub: "Midterm target: 85%+",
            color: "text-indigo-600 bg-indigo-50"
          },
          {
            label: "Topics Mastered",
            val: `${profile?.completed_topics_count || 14} / ${(profile?.completed_topics_count || 14) + (profile?.pending_topics_count || 5)}`,
            sub: "5 topics in revision queue",
            color: "text-blue-600 bg-blue-50"
          },
          {
            label: "Study Time Invested",
            val: `${profile?.total_study_time_hours || 18.5} hrs`,
            sub: "This study cycle",
            color: "text-emerald-600 bg-emerald-50"
          }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">{stat.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{stat.val}</span>
              <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Topic Mastery Breakdown (8 cols) + Weak Concepts & Recommendations (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Topic Mastery List */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Topic-Wise Comprehension & Mastery
            </h3>
            <span className="text-xs text-slate-400">Classified by Quiz Accuracy</span>
          </div>

          <div className="space-y-4">
            {profile?.topics?.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100/70 hover:border-purple-200 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                      {t.subject}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {t.topic}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-slate-800">
                      {t.mastery_score}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                {/* Mastery Progress Bar */}
                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${getBarColor(t.status)} h-full transition-all duration-500`}
                    style={{ width: `${t.mastery_score}%` }}
                  />
                </div>

                {/* Weak concepts alert tags & action recommendation */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  {t.weak_concepts?.length > 0 ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-semibold">Weak Spots:</span>
                      {t.weak_concepts.map((w, wi) => (
                        <span key={wi} className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                          {w}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High retention verified
                    </span>
                  )}

                  <span className="text-slate-500 italic">
                    {t.recommended_action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Recommendations & Adaptive Workflow */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Learning Recommendations Card */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Recommendations
            </h3>

            <div className="space-y-3">
              {profile?.learning_recommendations?.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100/70 text-xs text-slate-700 leading-relaxed">
                  {rec}
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenQuizModal("sample-physics-1", "Quantum Tunneling & Potential Barriers")}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
            >
              Start 3-Minute Quick Quiz <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* How Adaptive AI Works Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-100 space-y-3 text-xs leading-relaxed text-slate-700">
            <h4 className="font-bold text-purple-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              The Adaptive Feedback Loop
            </h4>
            <ol className="space-y-1.5 list-decimal pl-4 text-[11px] text-slate-600">
              <li>Identifies questions answered incorrectly in quizzes.</li>
              <li>Pins specific weak concepts (e.g. Banker's Algorithm safety state).</li>
              <li>Generates easier analogies to rebuild mental model.</li>
              <li>Reassesses until score reaches 80%+ before advancing.</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
}
