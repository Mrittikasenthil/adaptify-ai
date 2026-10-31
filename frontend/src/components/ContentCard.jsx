import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Edit3,
  Wand2,
  Globe,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  BookOpen,
  Mail,
  Megaphone,
  Loader2,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Share,
  MoreHorizontal,
  ThumbsUp,
  Send,
  Eye,
  Play,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import ConsistencyMeter from "./ConsistencyMeter";
import BrandConsistencyModal from "./BrandConsistencyModal";
import { api } from "../services/api";

export default function ContentCard({
  platform,
  outputText,
  consistencyScore = 94,
  scoreBreakdown,
  suggestions = [],
  projectId,
  outputId,
  brandProfileId,
  brandName = "Apex Cloud & AI",
  onUpdateContent
}) {
  const [content, setContent] = useState(outputText);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [currentScore, setCurrentScore] = useState(consistencyScore);
  const [previewMode, setPreviewMode] = useState("native"); // "native" | "editor"
  const [auditData, setAuditData] = useState({
    overall_score: consistencyScore,
    score_breakdown: scoreBreakdown,
    suggestions: suggestions
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${platform}_repurposed_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAIModifier = async (action, lang = "English") => {
    try {
      setModifying(true);
      const res = await api.modifyContent({
        content_text: content,
        action: action,
        target_language: lang,
        platform: platform,
        brand_profile_id: brandProfileId
      });

      setContent(res.modified_text);
      setCurrentScore(res.consistency_score);
      if (onUpdateContent) onUpdateContent(res.modified_text);
    } catch (e) {
      console.error("Modification failed", e);
    } finally {
      setModifying(false);
      setShowTranslateMenu(false);
    }
  };

  const handleOpenAudit = async () => {
    try {
      const res = await api.evaluateConsistency({
        content_text: content,
        platform: platform,
        brand_profile_id: brandProfileId
      });
      setAuditData(res);
      setCurrentScore(res.overall_score);
    } catch (e) {
      console.error(e);
    }
    setAuditModalOpen(true);
  };

  const handleApplyAutoFix = (fixedText) => {
    setContent(fixedText);
    setCurrentScore(98);
    if (onUpdateContent) onUpdateContent(fixedText);
  };

  const handleRegenerate = async () => {
    handleAIModifier("more_professional");
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  // Render Realistic Native Platform Card Previews
  const renderNativePreview = () => {
    if (platform === "instagram") {
      return (
        <div className="rounded-2xl bg-black border border-slate-800 text-white overflow-hidden shadow-2xl max-w-md mx-auto">
          {/* IG Header */}
          <div className="p-3 border-b border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold">
                  {brandName[0]}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold leading-none">{brandName.toLowerCase().replace(/\s+/g, "_")}</span>
                  <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">✓</span>
                </div>
                <span className="text-[10px] text-slate-400">Sponsored</span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* IG Visual Post Mockup */}
          <div className="h-44 bg-gradient-to-br from-brand-900/60 via-purple-950/40 to-slate-950 p-6 flex flex-col justify-center items-center text-center relative border-b border-slate-900">
            <span className="text-[10px] uppercase tracking-widest text-brand-400 font-extrabold mb-1">BrandFlow Spotlight</span>
            <div className="text-base font-extrabold text-white leading-tight max-w-xs drop-shadow-md">
              "{content.split("\n")[0] || "Compounding Creative Leverage"}"
            </div>
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white">
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span>{brandName}</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="p-3 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <MessageCircle className="w-5 h-5" />
              <Send className="w-5 h-5" />
            </div>
            <Bookmark className="w-5 h-5" />
          </div>

          <div className="px-3 pb-4 text-xs text-slate-200">
            <div className="font-bold text-[11px] mb-1">Liked by 1,482 others</div>
            <div className="leading-relaxed whitespace-pre-wrap line-clamp-6 font-sans text-xs">
              <span className="font-bold mr-1.5">{brandName.toLowerCase().replace(/\s+/g, "_")}</span>
              {content}
            </div>
          </div>
        </div>
      );
    }

    if (platform === "linkedin") {
      return (
        <div className="rounded-2xl bg-[#0F1420] border border-slate-800 text-slate-100 p-4 shadow-2xl max-w-xl mx-auto space-y-3 font-sans">
          {/* Author Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                {brandName[0]}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">{brandName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">• 1st</span>
                </div>
                <div className="text-[11px] text-slate-400">Enterprise AI Strategy & Observability Platform</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span>1d</span>
                  <span>•</span>
                  <span>Edited</span>
                  <span>•</span>
                  <span>🌐</span>
                </div>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>

          {/* Post Content */}
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans pt-1">
            {content}
          </div>

          {/* Social Counts Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-white">💡</span>
                <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[9px] text-white">❤️</span>
              </div>
              <span className="hover:underline cursor-pointer">418 • 64 comments</span>
            </div>
            <span className="hover:underline cursor-pointer">18 reposts</span>
          </div>

          {/* Interactive Action Bar */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-[11px] text-slate-300 font-semibold text-center">
            <button className="py-1.5 hover:bg-slate-800/60 rounded-lg flex items-center justify-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-400" /> Like
            </button>
            <button className="py-1.5 hover:bg-slate-800/60 rounded-lg flex items-center justify-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Comment
            </button>
            <button className="py-1.5 hover:bg-slate-800/60 rounded-lg flex items-center justify-center gap-1">
              <Repeat className="w-3.5 h-3.5" /> Repost
            </button>
            <button className="py-1.5 hover:bg-slate-800/60 rounded-lg flex items-center justify-center gap-1">
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
      );
    }

    if (platform === "twitter") {
      return (
        <div className="rounded-2xl bg-black border border-slate-800 text-slate-100 p-4 shadow-2xl max-w-md mx-auto space-y-3 font-sans">
          {/* X Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                {brandName[0]}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white">{brandName}</span>
                  <span className="w-3 h-3 rounded-full bg-sky-500 text-black flex items-center justify-center text-[8px] font-black">✓</span>
                </div>
                <div className="text-[11px] text-slate-500">@{brandName.toLowerCase().replace(/\s+/g, "")}</div>
              </div>
            </div>
            <Twitter className="w-4 h-4 text-slate-500" />
          </div>

          {/* Tweet Text */}
          <div className="text-xs text-slate-100 leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </div>

          <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-900">
            9:41 PM · Oct 31, 2026 · <span className="text-slate-300 font-semibold">48.2K</span> Views
          </div>

          {/* X Metrics */}
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
              <MessageCircle className="w-3.5 h-3.5" /> 38
            </span>
            <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
              <Repeat className="w-3.5 h-3.5" /> 112
            </span>
            <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
              <Heart className="w-3.5 h-3.5" /> 684
            </span>
            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
              <Bookmark className="w-3.5 h-3.5" /> 92
            </span>
          </div>
        </div>
      );
    }

    if (platform === "youtube_shorts") {
      return (
        <div className="rounded-3xl bg-black border-2 border-slate-800 text-white overflow-hidden shadow-2xl max-w-xs mx-auto relative aspect-[9/16] flex flex-col justify-between p-4">
          {/* Top Short Info */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-white" /> Shorts
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">0:45</span>
          </div>

          {/* Center Hook Overlay */}
          <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-center my-auto z-10 shadow-lg">
            <span className="text-[9px] uppercase tracking-widest text-red-400 font-black">Retention Hook</span>
            <div className="text-xs font-extrabold text-white mt-1 leading-snug">
              {content.split("\n")[0] || "Hook: The 1 Secret of 10x Distribution"}
            </div>
            <div className="text-[10px] text-slate-300 mt-2 line-clamp-3 leading-relaxed">
              {content.substring(0, 140)}...
            </div>
          </div>

          {/* Right Action Icons Stack */}
          <div className="absolute right-3 bottom-16 flex flex-col items-center gap-3 z-10 text-[10px]">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white flex flex-col items-center">
              <Heart className="w-4 h-4 fill-white" />
              <span className="mt-0.5 font-bold">24K</span>
            </div>
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white flex flex-col items-center">
              <MessageCircle className="w-4 h-4" />
              <span className="mt-0.5 font-bold">812</span>
            </div>
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white flex flex-col items-center">
              <Share className="w-4 h-4" />
              <span className="mt-0.5 font-bold">Share</span>
            </div>
          </div>

          {/* Bottom Channel Info */}
          <div className="z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-[10px]">
                {brandName[0]}
              </div>
              <span className="text-xs font-bold truncate max-w-[120px]">@{brandName.toLowerCase().replace(/\s+/g, "")}</span>
            </div>
            <button className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold">
              Subscribe
            </button>
          </div>
        </div>
      );
    }

    if (platform === "blog") {
      return (
        <div className="rounded-2xl bg-navy-950 border border-slate-800 text-slate-100 p-5 shadow-2xl max-w-xl mx-auto space-y-3 font-sans">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" /> Published by {brandName} • 4 min read
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto pr-2">
            {content}
          </div>
        </div>
      );
    }

    if (platform === "newsletter") {
      return (
        <div className="rounded-2xl bg-navy-950 border border-slate-800 text-slate-100 p-5 shadow-2xl max-w-xl mx-auto space-y-3 font-sans">
          <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-[11px] space-y-1">
            <div><span className="text-slate-500 font-semibold">From:</span> {brandName} &lt;updates@brandflow.ai&gt;</div>
            <div><span className="text-slate-500 font-semibold">Subject:</span> The Content Repurposing Playbook</div>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto pr-2">
            {content}
          </div>
        </div>
      );
    }

    // Default / Ad
    return (
      <div className="rounded-2xl bg-navy-950 border border-slate-800 text-slate-100 p-5 shadow-2xl max-w-xl mx-auto space-y-3 font-sans">
        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Megaphone className="w-3.5 h-3.5" /> Sponsored Advertisement
          </span>
          <span className="text-slate-500">Meta & Google Ready</span>
        </div>
        <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto pr-2">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="relative rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col transition-all duration-200">
      {/* Platform Header */}
      <div className="p-4 bg-gradient-to-r from-navy-850 to-navy-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
            {platform.replace("_", " ")}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <button
              onClick={() => setPreviewMode(previewMode === "native" ? "editor" : "native")}
              className={`px-2 py-0.5 rounded-lg border transition-colors ${
                previewMode === "native"
                  ? "bg-brand-600 text-white border-brand-500"
                  : "bg-navy-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {previewMode === "native" ? "👁️ Native Feed Preview" : "✏️ Raw Text View"}
            </button>
          </div>
        </div>

        <ConsistencyMeter
          score={currentScore}
          size="sm"
          onClickDetails={handleOpenAudit}
        />
      </div>

      {/* AI Modifiers Bar */}
      <div className="px-4 py-2 bg-navy-950/70 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-slate-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-brand-400" /> Refine:
        </span>
        <button
          disabled={modifying}
          onClick={() => handleAIModifier("shorter")}
          className="px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition-colors"
        >
          ✂️ Shorten
        </button>
        <button
          disabled={modifying}
          onClick={() => handleAIModifier("more_professional")}
          className="px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition-colors"
        >
          👔 Professional
        </button>
        <button
          disabled={modifying}
          onClick={() => handleAIModifier("casual")}
          className="px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition-colors"
        >
          ☕ Casual
        </button>
        <button
          disabled={modifying}
          onClick={() => handleAIModifier("urgent")}
          className="px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition-colors"
        >
          ⚡ Urgent
        </button>
        <button
          disabled={modifying}
          onClick={() => handleAIModifier("boost_engagement")}
          className="px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white shrink-0 transition-colors"
        >
          🚀 Viral Hook
        </button>

        {/* Translate dropdown */}
        <div className="relative shrink-0">
          <button
            disabled={modifying}
            onClick={() => setShowTranslateMenu(!showTranslateMenu)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy-850 hover:bg-slate-700 border border-slate-700 text-brand-300 hover:text-white transition-colors"
          >
            <Globe className="w-3 h-3 text-brand-400" />
            <span>Translate</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>

          {showTranslateMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowTranslateMenu(false)} />
              <div className="absolute left-0 mt-1.5 w-36 rounded-xl bg-navy-900 border border-slate-700 shadow-xl p-1 z-40">
                {["Tamil", "English", "Spanish", "French", "German", "Hindi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleAIModifier("translate", lang)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-brand-500/20 hover:text-white transition-colors"
                  >
                    {lang === "Tamil" ? "தமிழ் (Tamil)" : lang === "Hindi" ? "हिंदी (Hindi)" : lang}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {modifying && (
          <span className="flex items-center gap-1 text-brand-400 text-[10px] ml-auto shrink-0 animate-pulse font-medium">
            <Loader2 className="w-3 h-3 animate-spin" /> Adapting to Brand...
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">
        {previewMode === "native" && !isEditing ? (
          <div className="py-2">
            {renderNativePreview()}
          </div>
        ) : isEditing ? (
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (onUpdateContent) onUpdateContent(e.target.value);
            }}
            rows={10}
            className="w-full flex-1 p-3 rounded-xl bg-navy-950 border border-brand-500/40 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none font-mono"
            placeholder="Edit repurposed output..."
          />
        ) : (
          <div className="relative flex-1 p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto selection:bg-brand-500 selection:text-white font-sans">
            {content}
          </div>
        )}

        {/* Card Footer Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isEditing
                  ? "bg-brand-600 border-brand-500 text-white"
                  : "bg-navy-850 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title={isEditing ? "Save & Close Editor" : "Edit Text"}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded-lg bg-navy-850 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Regenerate with Brand Memory"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-navy-850 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Download as TXT"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20"
              }`}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Brand Consistency Detail Modal */}
      <BrandConsistencyModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        data={auditData}
        platform={platform}
        onApplyAutoFix={handleApplyAutoFix}
      />
    </div>
  );
}
