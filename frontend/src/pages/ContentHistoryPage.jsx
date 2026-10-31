import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  Filter,
  Copy,
  Check,
  ShieldCheck,
  Share2,
  Calendar,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  FileText,
  Mail,
  Zap,
  Loader2
} from "lucide-react";
import { api } from "../services/api";

const PLATFORM_ICONS = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube_shorts: Video,
  blog: FileText,
  newsletter: Mail,
  ad: Zap
};

export default function ContentHistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const projs = await api.getProjects();
        // Flatten outputs across projects
        let allOutputs = [];
        for (const p of projs.slice(0, 10)) {
          const details = await api.getProjectDetails(p.id).catch(() => null);
          if (details?.outputs) {
            allOutputs.push(
              ...details.outputs.map((o) => ({
                ...o,
                projectTitle: p.title,
                brandName: p.brand_name
              }))
            );
          }
        }
        setHistoryItems(allOutputs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = historyItems.filter((item) => {
    if (selectedPlatform !== "all" && item.platform !== selectedPlatform) return false;
    if (item.consistency_score < minScore) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Generation Log</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Content History</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search and audit all platform outputs generated with your Brand Memory engine.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Platforms</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="youtube_shorts">YouTube Shorts</option>
            <option value="blog">Blog Article</option>
            <option value="newsletter">Newsletter</option>
            <option value="ad">Promotional Ad</option>
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="0">All Scores</option>
            <option value="90">90%+ Score</option>
            <option value="95">95%+ High Match</option>
          </select>
        </div>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-400 text-xs font-semibold">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400 mr-2" /> Loading content history...
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const Icon = PLATFORM_ICONS[item.platform] || Share2;
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-slate-700 shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white capitalize">
                        {item.platform.replace("_", " ")}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-2 font-normal">
                        Campaign: <span className="text-slate-400 font-medium">{item.projectTitle}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      {item.consistency_score}% Match
                    </span>

                    <button
                      onClick={() => handleCopy(item.output_text, item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        copiedId === item.id
                          ? "bg-emerald-500 text-white"
                          : "bg-navy-850 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                      }`}
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-navy-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {item.output_text}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-navy-900/40 border border-dashed border-slate-800 text-xs text-slate-400">
          No history items match the selected filter.
        </div>
      )}
    </div>
  );
}
