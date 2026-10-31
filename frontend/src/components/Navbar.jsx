import React, { useEffect, useState } from "react";
import {
  Mic,
  Cpu,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Layers,
  FileText,
  Video,
  Presentation,
  Flame,
  Globe
} from "lucide-react";
import { api } from "../services/api";

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenVoiceModal,
  materials = [],
  selectedMaterialId,
  onSelectMaterial
}) {
  const [wisprStatus, setWisprStatus] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      const s = await api.getWisprStatus();
      setWisprStatus(s);
    }
    loadStatus();
  }, []);

  const titles = {
    overview: "Dashboard & AI Tutor Hub",
    tutor: "AI Tutor & Voice Studio",
    upload: "Smart Document Upload & Content Extraction",
    notes: "AI Study Notes Generator",
    adaptive: "Adaptive Learning & Student Model",
    quiz: "Practice Quizzes & Assessment Engine",
    planner: "Smart Study Planner & Exam Schedule",
    library: "Student Learning Library",
    analytics: "Learning Analytics & Comprehension",
    settings: "Profile & Study Preferences"
  };

  const activeMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-purple-100 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between shadow-2xs">
      
      {/* Title & Active Page */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
          {titles[activeTab] || "ADAPTIFY AI"}
        </h1>

        {/* Engine status badge */}
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-3 h-3 text-purple-600" />
          Adaptive AI Engine Active
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        
        {/* Active Material Selector Dropdown */}
        {materials.length > 0 && (
          <div className="relative hidden md:block">
            <select
              value={selectedMaterialId || (activeMaterial ? activeMaterial.id : "")}
              onChange={(e) => onSelectMaterial(e.target.value)}
              className="text-xs bg-purple-50/60 hover:bg-purple-50 border border-purple-200/80 rounded-xl px-3 py-1.5 pr-8 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors cursor-pointer max-w-[210px] truncate"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.file_type === "video" ? "📹 " : m.file_type === "ppt" ? "📊 " : "📄 "}
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Wispr Flow Status Badge */}
        <div
          onClick={onOpenVoiceModal}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200/70 text-purple-700 text-xs font-semibold transition-all"
          title="Click to open Voice Studio"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span>Wispr Flow Ready</span>
        </div>

        {/* Talk to AI Tutor Button */}
        <button
          onClick={onOpenVoiceModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span>Talk to Tutor</span>
        </button>
      </div>

    </header>
  );
}
