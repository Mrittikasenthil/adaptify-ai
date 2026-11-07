import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Copy,
  Download,
  Bookmark,
  Award,
  Check,
  ChevronDown,
  Layers,
  FileText,
  Flame,
  RotateCw,
  Eye,
  Sliders
} from "lucide-react";
import { api } from "../services/api";

export default function StudyNotesPage({
  selectedMaterial,
  onOpenQuizModal
}) {
  const [activeSection, setActiveSection] = useState("all");
  const [complexity, setComplexity] = useState("Exam-focused");
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    async function fetchNotes() {
      if (!selectedMaterial) return;
      setLoading(true);
      try {
        const data = await api.getNotesForMaterial(selectedMaterial.id);
        if (data) {
          setNotes(data);
        } else {
          const content = selectedMaterial.extracted_text || selectedMaterial.title;
          const gen = await api.generateNotes(
            content,
            selectedMaterial.title,
            complexity
          );
          if (gen) {
            setNotes(gen);
            try {
              localStorage.setItem("adaptify_notes_" + selectedMaterial.id, JSON.stringify(gen));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn("Notes error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [selectedMaterial, complexity]);

  const toggleFlip = (idx) => {
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyAll = () => {
    if (!notes) return;
    navigator.clipboard.writeText(JSON.stringify(notes, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!notes) return;
    const md = `# ${notes.title}
Complexity Level: ${complexity}

## Chapter Summary
${notes.chapter_summary}

## Key Points
${notes.key_points?.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## 2-Mark University Exam Questions
${notes.two_mark_qa?.map((qa, i) => `**Q${i + 1}: ${qa.q}**\n*Answer:* ${qa.a}`).join("\n\n")}

## 16-Mark Essay Answer
${notes.sixteen_mark_qa?.[0]?.a || ""}

## Quick Revision Sheet
${notes.revision_sheet?.map((r) => `- ${r}`).join("\n")}
    `;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${notes.title.replace(/[^a-zA-Z0-9]/g, "_")}_Complete_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: "all", label: "📚 Full Study Notes" },
    { id: "summary", label: "📝 Chapter Summary" },
    { id: "key_points", label: "📌 Key Points" },
    { id: "definitions", label: "📖 Definitions" },
    { id: "formulas", label: "🧮 Formulas" },
    { id: "two_marks", label: "🎯 2-Marks & 5-Marks" },
    { id: "sixteen_marks", label: "🏆 16-Mark Essays" },
    { id: "flashcards", label: "🃏 Flashcards" },
    { id: "revision", label: "⚡ Cram Sheet" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Action Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            12-Part AI Study Resource Generator
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            {notes?.title || selectedMaterial?.title || "Comprehensive Study Material"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured for university examination syllabus, formulas, derivations and quick recall.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Complexity Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="text-xs bg-purple-50/60 border border-purple-200 rounded-xl px-3 py-1.5 font-bold text-purple-800 focus:outline-none"
            >
              <option value="Beginner">🌱 Beginner</option>
              <option value="Intermediate">🎒 Intermediate</option>
              <option value="Advanced">🔬 Advanced</option>
              <option value="Exam-focused">🎯 Exam-Focused</option>
            </select>
          </div>

          <button
            onClick={handleCopyAll}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
            {copied ? "Copied All" : "Copy Notes"}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" /> Download (.md)
          </button>

          <button
            onClick={() => onOpenQuizModal(selectedMaterial?.id, selectedMaterial?.title)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" /> Practice Quiz
          </button>
        </div>
      </div>

      {/* Navigation Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === s.id
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white hover:bg-purple-50 border border-purple-100 text-slate-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Study Notes Content */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-purple-100">
          <Sparkles className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold">Synthesizing comprehensive academic notes...</p>
        </div>
      ) : notes ? (
        <div className="space-y-6">
          
          {/* Chapter Summary */}
          {(activeSection === "all" || activeSection === "summary") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" /> Complete Chapter Summary
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Concept Overview
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {notes.chapter_summary}
              </p>
            </div>
          )}

          {/* Key Points */}
          {(activeSection === "all" || activeSection === "key_points") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> Key Takeaways & Core Invariants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {notes.key_points?.map((kp, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100/70 text-xs text-slate-800 leading-normal flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{kp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Definitions */}
          {(activeSection === "all" || activeSection === "definitions") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">
                📖 Important Academic Definitions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notes.important_definitions?.map((d, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <h4 className="font-bold text-purple-900 text-xs sm:text-sm mb-1">{d.term}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{d.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas */}
          {(activeSection === "all" || activeSection === "formulas") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">
                🧮 Important Formulas & Mathematical Models
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notes.formulas?.map((f, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800">{f.name}</span>
                    <div className="p-2.5 rounded-xl bg-white border border-purple-200 font-mono text-purple-900 font-bold text-xs sm:text-sm overflow-x-auto">
                      {f.formula}
                    </div>
                    <p className="text-[11px] text-slate-500">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Mark and 5-Mark Questions */}
          {(activeSection === "all" || activeSection === "two_marks") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                🎯 University 2-Mark & 5-Mark Examination Questions
              </h3>
              <div className="space-y-3">
                {notes.two_mark_qa?.map((qa, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-purple-50/20 border border-purple-100 space-y-1.5 text-xs">
                    <span className="font-bold text-purple-900 block">
                      [2 Marks] Q{i + 1}. {qa.q}
                    </span>
                    <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-purple-400">
                      <strong>Answer:</strong> {qa.a}
                    </p>
                  </div>
                ))}

                {notes.five_mark_qa?.map((qa, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100 space-y-1.5 text-xs">
                    <span className="font-bold text-indigo-900 block">
                      [5 Marks] Q{i + 1}. {qa.q}
                    </span>
                    <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-indigo-400 whitespace-pre-wrap">
                      <strong>Answer:</strong> {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 16-Mark Essay Answer */}
          {(activeSection === "all" || activeSection === "sixteen_marks") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> 16-Mark University Essay Master Answer
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Full Marks Blueprint
                </span>
              </div>

              {notes.sixteen_mark_qa?.map((essay, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed">
                  <h4 className="font-extrabold text-purple-900 text-sm sm:text-base">
                    Question: {essay.q}
                  </h4>
                  <div className="prose prose-purple max-w-none whitespace-pre-wrap text-slate-700 pt-2 border-t border-slate-200">
                    {essay.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Flashcards */}
          {(activeSection === "all" || activeSection === "flashcards") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  🃏 Interactive Flip Flashcards (Click to Flip)
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">
                  {notes.flashcards?.length || 0} Cards
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.flashcards?.map((card, idx) => {
                  const isFlipped = flippedCards[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleFlip(idx)}
                      className={`h-40 p-5 rounded-3xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                        isFlipped
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-700 shadow-md"
                          : "bg-purple-50/50 hover:bg-purple-50 border-purple-100 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>Card {idx + 1}</span>
                        <span>{isFlipped ? "Answer" : "Question"}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-center leading-relaxed">
                        {isFlipped ? card.back : card.front}
                      </p>

                      <div className="flex items-center justify-center gap-1 text-[10px] opacity-70">
                        <RotateCw className="w-3 h-3" /> Click to flip
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Revision Cheat Sheet */}
          {(activeSection === "all" || activeSection === "revision") && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                ⚡ Last-Minute Exam Cram Sheet
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {notes.revision_sheet?.map((rev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-800">
                    {rev}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
}
