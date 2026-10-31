import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Brain,
  FileText,
  Target,
  Video,
  Presentation,
  FileCode,
  UploadCloud,
  Mic,
  Send,
  Copy,
  Download,
  Bookmark,
  Sparkles,
  HelpCircle,
  Volume2,
  Check,
  ChevronRight,
  Flame,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  AlertCircle
} from "lucide-react";
import AITutorRobot from "../components/AITutorRobot";
import { api } from "../services/api";

export default function DashboardOverview({
  materials = [],
  selectedMaterial,
  onSelectMaterial,
  onOpenVoiceModal,
  onOpenQuizModal,
  onUploadSuccess,
  onNavigateTab
}) {
  // Center Notes State
  const [activeNoteTab, setActiveNoteTab] = useState("key_points");
  const [complexity, setComplexity] = useState("Exam-focused");
  const [notesData, setNotesData] = useState(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Chat State (Ask Anything)
  const [chatInput, setChatInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hello Alex! I've loaded your study material. Ask me any question, request a 16-mark answer, or click the mic to speak!",
      time: "Just now"
    }
  ]);

  // Upload Panel State
  const [uploadType, setUploadType] = useState("pdf"); // "video" | "ppt" | "pdf" | "image"
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Active workflow stage (1: Analyze -> 2: Extract -> 3: Smart Notes -> 4: Personalized)
  const [workflowStep, setWorkflowStep] = useState(3);

  // Load notes whenever selected material or complexity changes
  useEffect(() => {
    async function loadNotes() {
      if (!selectedMaterial) return;
      setIsLoadingNotes(true);
      try {
        const notes = await api.getNotesForMaterial(selectedMaterial.id);
        if (notes) {
          setNotesData(notes);
        } else {
          // Generate notes
          const generated = await api.generateNotes(
            selectedMaterial.extracted_text || selectedMaterial.title,
            selectedMaterial.title,
            complexity
          );
          setNotesData(generated);
        }
      } catch (err) {
        console.warn("Notes load fallback:", err);
      } finally {
        setIsLoadingNotes(false);
      }
    }
    loadNotes();
  }, [selectedMaterial, complexity]);

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFileUpload(e.target.files[0]);
    }
  };

  const processFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(20);
    setUploadStage("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type_hint", uploadType);

    try {
      setTimeout(() => { setUploadProgress(50); setUploadStage("Extracting text & formulas..."); }, 400);
      setTimeout(() => { setUploadProgress(80); setUploadStage("Generating smart study notes..."); }, 800);

      const res = await api.uploadMaterial(formData);
      setUploadProgress(100);
      setUploadStage("Completed!");

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStage("");
        if (onUploadSuccess) onUploadSuccess(res.material);
        if (res.notes) setNotesData(res.notes);
      }, 500);
    } catch (err) {
      alert("Upload failed: " + err.message);
      setIsUploading(false);
    }
  };

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setIsUploading(true);
    setUploadProgress(30);
    setUploadStage("Fetching YouTube video transcript...");

    const formData = new FormData();
    formData.append("youtube_url", youtubeUrl.trim());
    formData.append("file_type_hint", "video");

    try {
      setTimeout(() => { setUploadProgress(70); setUploadStage("Analyzing lecture concepts..."); }, 500);
      const res = await api.uploadMaterial(formData);
      setUploadProgress(100);
      setUploadStage("Completed!");
      setYoutubeUrl("");

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStage("");
        if (onUploadSuccess) onUploadSuccess(res.material);
        if (res.notes) setNotesData(res.notes);
      }, 500);
    } catch (err) {
      alert("YouTube import failed: " + err.message);
      setIsUploading(false);
    }
  };

  // Chat Ask Question
  const handleAskQuestion = async (queryText = chatInput) => {
    const q = (queryText || "").trim();
    if (!q) return;

    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: q, time: "Just now" }
    ]);
    setIsAsking(true);

    try {
      const activeCtx = notesData ? `${notesData.chapter_summary}\n${notesData.key_points?.join("\n")}` : "";
      const res = await api.askTutor(q, activeCtx);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, time: "Just now" }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not retrieve answer. Please try again!", time: "Just now" }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // Copy Notes
  const handleCopyNotes = () => {
    if (!notesData) return;
    const textToCopy = `
${notesData.title}
=========================
SUMMARY:
${notesData.chapter_summary}

KEY POINTS:
${notesData.key_points?.map((k, i) => `${i + 1}. ${k}`).join("\n")}

SIMPLE EXPLANATION:
${notesData.simple_explanation}

FORMULAS:
${notesData.formulas?.map((f) => `${f.name}: ${f.formula}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Notes
  const handleDownloadNotes = () => {
    if (!notesData) return;
    const markdownContent = `# ${notesData.title}

## Summary
${notesData.chapter_summary}

## Key Points
${notesData.key_points?.map((k) => `- ${k}`).join("\n")}

## Simple Explanation
${notesData.simple_explanation}

## Important Definitions
${notesData.important_definitions?.map((d) => `### ${d.term}\n${d.definition}`).join("\n\n")}

## Formulas
${notesData.formulas?.map((f) => `- **${f.name}**: \`${f.formula}\`\n  *${f.description}*`).join("\n\n")}

## Quick Revision Sheet
${notesData.revision_sheet?.map((r) => `- ${r}`).join("\n")}
    `;

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${notesData.title.replace(/[^a-zA-Z0-9]/g, "_")}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNotes = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const featureCards = [
    {
      title: "Saves Time",
      desc: "Convert lengthy materials into structured revision notes.",
      icon: Zap,
      bg: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: "Improves Understanding",
      desc: "Get clear explanations, key concepts and analogical breakdowns.",
      icon: Brain,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Smart Summaries",
      desc: "Summarize videos, PDFs and presentations with high precision.",
      icon: FileText,
      bg: "bg-violet-50 text-violet-600 border-violet-100"
    },
    {
      title: "Personalized Learning",
      desc: "Receive tailored explanations adjusted to your learning level.",
      icon: Target,
      bg: "bg-blue-50 text-blue-600 border-blue-100"
    }
  ];

  const suggestedQuestions = [
    "Explain this topic in simple words",
    "What are the important exam questions?",
    "Generate 10 MCQs from this chapter",
    "Explain this diagram",
    "Give me 16-mark exam answers",
    "Summarize this topic in Tanglish"
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      
      {/* 3-COLUMN MASTER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* 1. LEFT SECTION – BRANDING AND FEATURES (3 cols)          */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Branding Banner */}
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm card-hover-glow transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Exam Preparation Studio
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              ADAPTIFY<span className="text-purple-600"> AI</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Learn Faster. Understand Better. Achieve More.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Core Capabilities
            </h3>
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-purple-100/80 shadow-2xs hover:border-purple-300 transition-all flex items-start gap-3 group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${feat.bg} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Uploaded Content Previews (Video, PPT, PDF) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Uploaded Materials
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {materials.length} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {materials.map((mat) => {
                const isSelected = selectedMaterial?.id === mat.id;
                const isVideo = mat.file_type === "video";
                const isPPT = mat.file_type === "ppt";
                return (
                  <div
                    key={mat.id}
                    onClick={() => onSelectMaterial(mat.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-purple-50/80 border-purple-500 shadow-xs"
                        : "bg-white hover:bg-purple-50/30 border-purple-100 hover:border-purple-200"
                    }`}
                  >
                    {/* Thumbnail Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isVideo
                          ? "bg-rose-100 text-rose-600"
                          : isPPT
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isVideo ? (
                        <Video className="w-5 h-5" />
                      ) : isPPT ? (
                        <Presentation className="w-5 h-5" />
                      ) : (
                        <FileCode className="w-5 h-5" />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {mat.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="font-semibold uppercase">{mat.file_type}</span>
                        <span>•</span>
                        <span>{mat.duration_or_pages}</span>
                      </div>
                    </div>

                    {/* Processed Status Badge */}
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      Processed
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. CENTER SECTION – AI TUTOR & SMART NOTES (6 cols)       */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Prominent AI Tutor Robot Card */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
            
            {/* Robot Illustration */}
            <div className="shrink-0">
              <AITutorRobot 
                state={isLoadingNotes ? "thinking" : isAsking ? "speaking" : "idle"}
                size="md"
                onClick={onOpenVoiceModal}
              />
            </div>

            {/* Welcome & Prompt */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Adaptive AI Exam-Prep Tutor
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                "Hi! I'm your AI Tutor.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                I turn complex learning materials into simple explanations, notes and interactive lessons.
              </p>

              {/* Talk to AI Tutor Button */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                <button
                  onClick={onOpenVoiceModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                  Talk to Your AI Tutor
                </button>

                <button
                  onClick={() => onOpenQuizModal(selectedMaterial?.id, selectedMaterial?.title)}
                  className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Award className="w-4 h-4" /> Practice Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Animated Workflow Pipeline Bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-purple-100/80 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 overflow-x-auto gap-2 py-1">
              {[
                { step: 1, label: "Analyze Content" },
                { step: 2, label: "Extract Key Points" },
                { step: 3, label: "Generate Smart Notes" },
                { step: 4, label: "Personalized Learning" }
              ].map((item, idx) => (
                <React.Fragment key={item.step}>
                  <div
                    onClick={() => setWorkflowStep(item.step)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                      workflowStep === item.step
                        ? "bg-purple-600 text-white shadow-xs"
                        : "hover:text-purple-600 text-slate-500"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      workflowStep === item.step ? "bg-white text-purple-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {item.step}
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {idx < 3 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Large AI-Generated Notes Panel */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden flex flex-col">
            
            {/* Notes Header & Complexity Selector */}
            <div className="p-5 border-b border-purple-100/80 bg-gradient-to-r from-purple-50/40 via-white to-indigo-50/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  AI Study Notes
                </span>
                <h3 className="text-base font-bold text-slate-800">
                  {notesData?.title || selectedMaterial?.title || "Comprehensive Study Material"}
                </h3>
              </div>

              {/* Complexity Level Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Level:</span>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="text-xs bg-white border border-purple-200 rounded-xl px-2.5 py-1 text-purple-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="High School">🎒 High School</option>
                  <option value="Exam-focused">🎯 Exam-Ready (College)</option>
                  <option value="Professor Depth">🔬 Professor Depth</option>
                </select>
              </div>
            </div>

            {/* Note Sub-Tabs */}
            <div className="px-5 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-xs py-2 bg-[#FAF9FF]">
              {[
                { id: "key_points", label: "📌 Key Points" },
                { id: "simple_explanation", label: "💡 Simple Explanation" },
                { id: "definitions", label: "📖 Important Definitions" },
                { id: "formulas", label: "🧮 Formulas" },
                { id: "examples", label: "🔬 Examples" },
                { id: "diagrams", label: "📊 Diagrams" },
                { id: "revision", label: "⚡ Quick Revision" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNoteTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    activeNoteTab === tab.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-purple-700 hover:bg-purple-100/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notes Tab Content */}
            <div className="p-6 min-h-[300px] text-xs sm:text-sm text-slate-700 leading-relaxed overflow-y-auto max-h-[460px]">
              {isLoadingNotes ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Sparkles className="w-6 h-6 text-purple-500 animate-spin" />
                  <p className="text-xs font-semibold">Generating adaptive notes...</p>
                </div>
              ) : notesData ? (
                <div>
                  {/* Tab 1: Key Points */}
                  {activeNoteTab === "key_points" && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 font-medium">
                        {notesData.chapter_summary}
                      </div>

                      <div className="space-y-2.5 mt-4">
                        {notesData.key_points?.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-800 leading-normal">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Simple Explanation */}
                  {activeNoteTab === "simple_explanation" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 leading-relaxed text-slate-800">
                        <span className="font-bold text-indigo-700 block mb-1">
                          ✨ Intuitive Real-World Analogy:
                        </span>
                        {notesData.simple_explanation}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Definitions */}
                  {activeNoteTab === "definitions" && (
                    <div className="space-y-3">
                      {notesData.important_definitions?.map((def, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white border border-purple-100/70 shadow-2xs">
                          <h4 className="font-bold text-purple-900 text-xs sm:text-sm">
                            {def.term}
                          </h4>
                          <p className="text-slate-600 text-xs mt-1">
                            {def.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Formulas */}
                  {activeNoteTab === "formulas" && (
                    <div className="space-y-3">
                      {notesData.formulas?.map((f, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{f.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              Formula
                            </span>
                          </div>
                          <div className="my-2 p-2.5 rounded-xl bg-white border border-purple-200/80 font-mono text-purple-900 text-xs sm:text-sm font-bold overflow-x-auto">
                            {f.formula}
                          </div>
                          <p className="text-[11px] text-slate-500">{f.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 5: Examples */}
                  {activeNoteTab === "examples" && (
                    <div className="space-y-4">
                      {notesData.examples?.map((ex, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                            {ex.title}
                          </h4>
                          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs">
                            <strong>Problem:</strong> {ex.problem}
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-800 text-xs whitespace-pre-wrap">
                            <strong>Solution:</strong>\n{ex.solution}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 6: Diagrams */}
                  {activeNoteTab === "diagrams" && (
                    <div className="space-y-4">
                      {notesData.diagrams?.map((diag, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100/80 space-y-2">
                          <h4 className="font-bold text-purple-900 text-xs sm:text-sm">
                            {diag.title}
                          </h4>
                          <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-tight shadow-inner">
                            {diag.ascii_art.trim()}
                          </pre>
                          <p className="text-xs text-slate-600 mt-2">
                            {diag.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 7: Quick Revision */}
                  {activeNoteTab === "revision" && (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-600" />
                        High-Yield Last Minute Exam Cram Sheet
                      </div>
                      {notesData.revision_sheet?.map((rev, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 transition-colors text-xs font-medium text-slate-800">
                          {rev}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Actions Bar (Copy, Download, Save, Quiz) */}
            <div className="p-4 bg-slate-50 border-t border-purple-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotes}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
                  {copied ? "Copied!" : "Copy Notes"}
                </button>

                <button
                  onClick={handleDownloadNotes}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" /> Download (.md)
                </button>

                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? "text-emerald-600 fill-emerald-600" : "text-amber-500"}`} />
                  {saved ? "Saved to Library!" : "Save"}
                </button>
              </div>

              <button
                onClick={() => onOpenQuizModal(selectedMaterial?.id, selectedMaterial?.title)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" /> Launch Quiz
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT SECTION – UPLOAD ANYTHING & ASK ANYTHING (3 cols)*/}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Upload Anything Panel */}
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-purple-600" />
                Upload Anything
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">All Formats</span>
            </div>

            {/* 4 Upload Options Selector */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "video", label: "Video", icon: Video },
                { id: "ppt", label: "PPT Slides", icon: Presentation },
                { id: "pdf", label: "PDF Document", icon: FileText },
                { id: "image", label: "Diagram / Image", icon: FileCode }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = uploadType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setUploadType(t.id)}
                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-50 hover:bg-purple-50/50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragOver
                  ? "border-purple-600 bg-purple-50/80 scale-[1.02]"
                  : "border-purple-200 hover:border-purple-400 bg-purple-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={uploadType === "video" ? "video/*" : uploadType === "ppt" ? ".ppt,.pptx" : uploadType === "pdf" ? ".pdf" : "image/*"}
              />
              <UploadCloud className="w-8 h-8 text-purple-500 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-800">
                Drag & drop or browse
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {uploadType === "video" ? "MP4, MOV, WEBM" : uploadType === "ppt" ? "PowerPoint .pptx, .ppt" : uploadType === "pdf" ? "PDF Documents & Books" : "PNG, JPG, Diagrams"}
              </p>
            </div>

            {/* YouTube Link Input (if video selected) */}
            {uploadType === "video" && (
              <form onSubmit={handleYoutubeSubmit} className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Or enter YouTube Lecture Link:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all"
                  >
                    Import
                  </button>
                </div>
              </form>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 p-3 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900">
                  <span>{uploadStage}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-purple-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ask Anything Panel (AI Chat) */}
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                Ask Anything
              </h3>
              <button
                onClick={onOpenVoiceModal}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all flex items-center gap-1"
              >
                <Mic className="w-3 h-3 text-purple-600" /> Voice Mode
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-purple-50/70 border border-purple-100 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
              {isAsking && (
                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> AI Tutor is answering...
                </div>
              )}
            </div>

            {/* Suggested Question Chips */}
            <div className="pt-2 border-t border-purple-100/60">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                Suggested Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {suggestedQuestions.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskQuestion(sq)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors font-medium text-left truncate max-w-[240px]"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input (Wispr Flow Compatible) */}
            <div className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                  placeholder="Dictate with Wispr Flow or type..."
                  className="w-full text-xs pl-3 pr-16 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-purple-50/20 text-slate-800 placeholder-slate-400"
                />

                <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                  <button
                    onClick={onOpenVoiceModal}
                    className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                    title="Open Voice Studio"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleAskQuestion()}
                    disabled={!chatInput.trim() || isAsking}
                    className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 text-center">
                Wispr Flow dictation active on focused input
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM / ADAPTIVE LEARNING PROGRESS BAR                */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric 1: Overall Mastery */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
            84%
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Overall Comprehension</h4>
            <p className="text-[11px] text-slate-500">Based on recent quizzes</p>
          </div>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base">
            🔥 7
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Day Study Streak</h4>
            <p className="text-[11px] text-slate-500">2.2 / 3.0 hrs today</p>
          </div>
        </div>

        {/* Metric 3: Weak Concepts Tag */}
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">Target Weak Concept</h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              Banker's Algorithm
            </span>
          </div>
        </div>

        {/* Action: Open Adaptive Learning Page */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => onNavigateTab("adaptive")}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            View Adaptive Model <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
