import React, { useState, useEffect } from "react";
import {
  Library,
  Search,
  Filter,
  FileText,
  Video,
  Presentation,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2
} from "lucide-react";
import { api } from "../services/api";

export default function LearningLibraryPage({
  materials = [],
  selectedMaterial,
  onSelectMaterial,
  onNavigateNotes,
  onOpenQuizModal
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "video" | "ppt" | "pdf"

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || m.file_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Student Resource Vault
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Learning Library
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your centralized repository of uploaded materials, generated notes, and adaptive quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {materials.length} Active Resources
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, topics, or formulas..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {["all", "video", "ppt", "pdf"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                filterType === t
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((m) => {
          const isVideo = m.file_type === "video";
          const isPPT = m.file_type === "ppt";
          return (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isVideo
                        ? "bg-rose-100 text-rose-600"
                        : isPPT
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isVideo ? <Video className="w-5 h-5" /> : isPPT ? <Presentation className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Processed
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2">
                  {m.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {m.extracted_text}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-100/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">
                  {m.duration_or_pages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectMaterial(m.id);
                      if (onNavigateNotes) onNavigateNotes();
                    }}
                    className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                  >
                    Study Notes
                  </button>

                  <button
                    onClick={() => onOpenQuizModal(m.id, m.title)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors"
                    title="Take Quiz"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
