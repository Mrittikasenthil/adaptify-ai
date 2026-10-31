import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  const weeklyActivity = [
    { day: "Mon", hours: 2.5, height: "65%" },
    { day: "Tue", hours: 3.2, height: "80%" },
    { day: "Wed", hours: 1.8, height: "45%" },
    { day: "Thu", hours: 4.0, height: "100%" },
    { day: "Fri", hours: 3.0, height: "75%" },
    { day: "Sat", hours: 3.5, height: "88%" },
    { day: "Sun", hours: 2.2, height: "55%" }
  ];

  const subjectComprehension = [
    { subject: "Operating Systems", score: 92, status: "Strong", questions: 32 },
    { subject: "Engineering Physics", score: 68, status: "Improving", questions: 24 },
    { subject: "Data Structures", score: 84, status: "Strong", questions: 40 },
    { subject: "Computer Architecture", score: 55, status: "Needs Practice", questions: 16 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Cognitive Comprehension Analytics
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Learning Progress & Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed insights into your study habits, knowledge retention, and syllabus mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            18.5 Total Hours Tracked
          </span>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Mastery", val: "84%", sub: "+6% this week", color: "text-purple-600" },
          { label: "Study Streak", val: "7 Days", sub: "Top 5% consistency", color: "text-orange-500" },
          { label: "Quiz Accuracy", val: "82.5%", sub: "45 questions solved", color: "text-indigo-600" },
          { label: "Average Session", val: "42 mins", sub: "Optimal retention zone", color: "text-emerald-600" }
        ].map((s, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-500">{s.label}</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
              <span className="text-[10px] font-bold text-slate-400">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts: Weekly Study Activity & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Activity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" /> Weekly Study Activity (Hours)
            </h3>
            <span className="text-xs text-slate-400">Target: 3.0 hrs/day</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyActivity.map((w, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {w.hours}h
                </span>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-purple-600 to-indigo-500 rounded-xl transition-all duration-300 group-hover:from-purple-500 group-hover:to-indigo-400"
                  style={{ height: w.height }}
                />
                <span className="text-xs font-semibold text-slate-500 mt-1">
                  {w.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-Wise Comprehension (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" /> Subject Comprehension
            </h3>
          </div>

          <div className="space-y-4">
            {subjectComprehension.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{sub.subject}</span>
                  <span className="text-purple-700">{sub.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.score >= 80 ? "bg-emerald-500" : sub.score >= 65 ? "bg-indigo-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{sub.questions} questions answered</span>
                  <span className="font-semibold">{sub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Performance Insights */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> AI Diagnostic Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-purple-100">
            <strong>Retention Spike:</strong> Your accuracy in CPU Scheduling jumped by 24% after reviewing flashcards. The spacing interval method is proving highly effective.
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-purple-100">
            <strong>Recommended Next Step:</strong> Dedicate your next study session to Barrier Potentials in Quantum Mechanics to raise your score above 75%.
          </div>
        </div>
      </div>

    </div>
  );
}
