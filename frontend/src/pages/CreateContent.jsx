import React, { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  FileText,
  Mic,
  Video,
  Type,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  Copy,
  Download,
  Eye,
  Columns,
  RefreshCw,
  Zap,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Play,
  RotateCcw,
  Sliders,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { useBrand } from "../context/BrandContext";
import { api } from "../services/api";
import ContentCard from "../components/ContentCard";

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn Post", icon: Linkedin, desc: "Thought leadership & line-breaks" },
  { id: "twitter", name: "Twitter / X Post", icon: Twitter, desc: "Viral hooks & concise threads" },
  { id: "instagram", name: "Instagram Caption", icon: Instagram, desc: "Storytelling, emojis & hashtags" },
  { id: "youtube_shorts", name: "YouTube Shorts", icon: Video, desc: "0-3s retention hook & visual cues" },
  { id: "blog", name: "Blog Article", icon: FileText, desc: "SEO Title, H2/H3s & key takeaways" },
  { id: "newsletter", name: "Email Newsletter", icon: Share2, desc: "Subject variants, body & CTA button" },
  { id: "ad", name: "Promotional Ad", icon: Zap, desc: "Headline angles & conversion copy" }
];

export default function CreateContent({ onProjectCreated }) {
  const { brandProfiles, activeBrand, selectActiveBrand } = useBrand();

  const [inputMode, setInputMode] = useState("text"); // "text" | "pdf" | "audio" | "video"
  const [title, setTitle] = useState("Mastering System Velocity & AI Architecture");
  const [rawText, setRawText] = useState(
    "Modern software teams struggle with cloud fragmentation. Rather than adding more observability tabs, teams need unified telemetry and automated root cause analysis. This compounds engineering velocity by 40% and builds an architectural moat that competitors cannot easily copy. Stop treating symptoms—engineer resilience into the foundation."
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "linkedin",
    "twitter",
    "instagram",
    "youtube_shorts",
    "blog",
    "newsletter",
    "ad"
  ]);
  const [language, setLanguage] = useState("English");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0); // 0, 1, 2, 3
  const [uploadStatus, setUploadStatus] = useState(null);
  const [generationResults, setGenerationResults] = useState(null);
  const [activePreviewTab, setActivePreviewTab] = useState("all");

  const fileInputRef = useRef(null);

  const samplePresets = [
    {
      label: "⚡ Cloud & Tech SaaS",
      title: "Mastering System Velocity & AI Architecture",
      text: "Modern software teams struggle with cloud fragmentation. Rather than adding more observability tabs, teams need unified telemetry and automated root cause analysis. This compounds engineering velocity by 40% and builds an architectural moat that competitors cannot easily copy."
    },
    {
      label: "🌿 Eco-Living & Wellness",
      title: "The Zero-Waste Mindful Home Protocol",
      text: "Small conscious habits quietly ripple into monumental environmental healing. Every refill is a gentle act of stewardship for tomorrow. By choosing earth-first botanical rituals, we nurture our spaces while honoring the regenerative rhythm of nature."
    },
    {
      label: "🛡️ Cybersecurity Threat Brief",
      title: "Zero-Trust Architecture & Credential Vectors",
      text: "Perimeters do not stop modern adversaries; continuous identity verification does. When credential hygiene slips, lateral movement begins within 8 minutes. Security teams must enforce strict telemetry to reduce the attack surface."
    }
  ];

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(PLATFORMS.map((p) => p.id));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus(null);
      const res = await api.uploadFile(file);
      setRawText(res.extracted_text || "");
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      setUploadStatus({
        type: "success",
        text: `Extracted ${res.content_type.toUpperCase()} successfully from '${file.name}'. You can edit the text below before generating.`
      });
    } catch (err) {
      setUploadStatus({
        type: "error",
        text: err.message || "Failed to process file."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRepurpose = async () => {
    if (!rawText.trim()) return;

    try {
      setIsGenerating(true);
      setGenerationStep(1);

      const stepInterval = setInterval(() => {
        setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 700);

      const res = await api.repurposeContent({
        original_content: rawText,
        title: title || "Repurposed Campaign",
        content_type: inputMode,
        brand_profile_id: activeBrand?.id,
        platforms: selectedPlatforms,
        language: language
      });

      clearInterval(stepInterval);
      setGenerationResults(res);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onProjectCreated) onProjectCreated(res);
    } catch (err) {
      console.error("Repurposing failed", err);
      alert(err.message || "Content generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleExportAll = () => {
    if (!generationResults) return;
    let exportText = `===========================================================\nBRANDFLOW AI REPURPOSED EXPORT\nProject: ${generationResults.title}\nBrand Memory: ${activeBrand?.brand_name || "Apex Cloud"}\n===========================================================\n\n--- ORIGINAL SOURCE CONTENT ---\n${generationResults.original_content}\n\n`;

    generationResults.outputs.forEach((out) => {
      exportText += `\n===========================================================\nPLATFORM: ${out.platform.toUpperCase()} (Score: ${out.consistency_score}/100)\n===========================================================\n${out.output_text}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([exportText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "_")}_full_campaign.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const displayedOutputs = generationResults?.outputs?.filter((out) => {
    if (activePreviewTab === "all") return true;
    return out.platform === activePreviewTab;
  }) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Studio Workspace</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Content Generation Studio</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Split-screen creative workspace. Ingest any anchor asset on the left; preview native channel deliverables on the right.
          </p>
        </div>

        {/* Active Brand Memory Selector Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-900 border border-brand-500/40 shadow-xl">
          <BrainCircuit className="w-5 h-5 text-brand-400 shrink-0" />
          <div className="text-left text-xs">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Enforcing Brand DNA:</span>
            <span className="font-bold text-white truncate max-w-[150px] block">
              {activeBrand?.brand_name || "Apex Cloud & AI"}
            </span>
          </div>
        </div>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE: Ingestion, Presets, Platforms & Brand Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets Bar for Instant Demo Testing */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-brand-400" /> 1-Click Demo Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(p.title);
                    setRawText(p.text);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Title & Format Selector */}
          <div className="p-5 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Campaign Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
                placeholder="Campaign / Topic Title"
              />
            </div>

            {/* Ingestion Format Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Ingestion Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "text", label: "Text", icon: Type },
                  { id: "pdf", label: "PDF", icon: FileText },
                  { id: "audio", label: "Audio", icon: Mic },
                  { id: "video", label: "Video", icon: Video }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = inputMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setInputMode(mode.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-brand-600/20 border-brand-500 text-brand-300 shadow-sm"
                          : "bg-navy-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload Area for PDF / Audio / Video */}
            {inputMode !== "text" && (
              <div className="p-5 rounded-2xl bg-navy-950 border-2 border-dashed border-slate-700 hover:border-brand-500/60 text-center transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept={
                    inputMode === "pdf"
                      ? ".pdf"
                      : inputMode === "audio"
                      ? ".mp3,.wav,.m4a,.aac,.ogg"
                      : ".mp4,.mov,.webm,.mkv"
                  }
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer space-y-2 py-2"
                >
                  <div className="p-3 w-fit mx-auto rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {isUploading ? "Transcribing & Extracting..." : `Upload ${inputMode.toUpperCase()} File`}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {inputMode === "pdf"
                      ? "Extracts full text with formatting"
                      : "Automatic speech-to-text transcript generated with speaker cadence"}
                  </p>
                </div>
              </div>
            )}

            {/* Upload status message */}
            {uploadStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  uploadStatus.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {uploadStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{uploadStatus.text}</span>
              </div>
            )}

            {/* Extracted / Raw Source Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Extracted Source Content
                </label>
                <span className="text-[10px] text-slate-500">
                  {rawText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-navy-950 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-brand-500 font-sans"
                placeholder="Paste original source text or podcast script..."
              />
            </div>
          </div>

          {/* Platform Selection Hub */}
          <div className="p-5 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Output Channels
              </label>
              <button
                type="button"
                onClick={selectAllPlatforms}
                className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
              >
                Select All 7 Formats
              </button>
            </div>

            <div className="space-y-2">
              {PLATFORMS.map((p) => {
                const Icon = p.icon;
                const isChecked = selectedPlatforms.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-navy-850 border-brand-500/40 text-white shadow-sm"
                        : "bg-navy-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xl ${isChecked ? "bg-brand-500/20 text-brand-400" : "bg-slate-800 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.desc}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-slate-700 text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                  </div>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Globe className="w-4 h-4 text-brand-400" />
                <span>Language Dialect:</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="English">English</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="French">Français (French)</option>
                <option value="German">Deutsch (German)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Generate All Formats Button with Animated AI Processing State */}
            <button
              onClick={handleRepurpose}
              disabled={isGenerating || !rawText.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-2xl shadow-brand-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {generationStep === 1
                        ? "Stage 1/3: Parsing Anchor Narrative..."
                        : generationStep === 2
                        ? "Stage 2/3: Querying Brand Memory DNA & Guardrails..."
                        : "Stage 3/3: Synthesizing 7 Channel Native Dialects..."}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate All Formats with Brand Memory ({selectedPlatforms.length} Channels)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: AI Generated Content Previews */}
        <div className="lg:col-span-7 space-y-6">
          {generationResults ? (
            <div className="space-y-6">
              {/* Output Header Controls */}
              <div className="p-4 rounded-3xl bg-navy-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{generationResults.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Generated Live
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {generationResults.outputs?.length} formats adapted using Brand Memory:{" "}
                    <span className="text-brand-300 font-semibold">{activeBrand?.brand_name || "Apex Cloud"}</span>
                  </p>
                </div>

                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Campaign (TXT)</span>
                </button>
              </div>

              {/* Platform Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActivePreviewTab("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activePreviewTab === "all"
                      ? "bg-brand-600 text-white"
                      : "bg-navy-900 text-slate-400 hover:text-white"
                  }`}
                >
                  All Channels ({generationResults.outputs.length})
                </button>
                {generationResults.outputs.map((out) => (
                  <button
                    key={out.platform}
                    onClick={() => setActivePreviewTab(out.platform)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                      activePreviewTab === out.platform
                        ? "bg-brand-600 text-white font-bold"
                        : "bg-navy-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {out.platform.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Render Native Platform Cards */}
              <div className="space-y-6">
                {displayedOutputs.map((out, idx) => (
                  <ContentCard
                    key={out.platform || idx}
                    platform={out.platform}
                    outputText={out.output_text}
                    consistencyScore={out.consistency_score}
                    scoreBreakdown={out.score_breakdown}
                    suggestions={out.suggestions}
                    projectId={generationResults.project_id}
                    brandProfileId={activeBrand?.id}
                    brandName={activeBrand?.brand_name || "Apex Cloud & AI"}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-navy-900/60 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="p-4 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-4 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Your Repurposed Campaign Will Appear Here</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                Click a preset above or paste your source text, select your target channels, and click "Generate All Formats" to see realistic native platform previews.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500">
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ LinkedIn Thought Leadership</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ Twitter / X Viral Thread</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ Instagram Caption & Carousel</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ YouTube Shorts Visual Script</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ SEO Blog Article</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ Email Newsletter</span>
                <span className="px-3 py-1 rounded-xl bg-navy-950 border border-slate-800">✓ High-Converting Ad Copy</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
