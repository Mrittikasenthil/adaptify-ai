import React from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function ConsistencyMeter({ score, breakdown, onClickDetails, size = "md" }) {
  const getColors = (s) => {
    if (s >= 90) return { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-400" };
    if (s >= 75) return { bg: "bg-brand-500/10", border: "border-brand-500/30", text: "text-brand-400", bar: "bg-brand-500" };
    return { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-400" };
  };

  const colors = getColors(score);

  if (size === "sm") {
    return (
      <button
        onClick={onClickDetails}
        title="Click to view Brand Consistency breakdown"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colors.bg} ${colors.border} ${colors.text} hover:scale-105 transition-transform`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{score}% Brand Match</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClickDetails}
      className={`p-3 rounded-xl border ${colors.bg} ${colors.border} cursor-pointer hover:border-slate-500/50 transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${colors.text}`} />
          <span className="text-xs font-semibold text-slate-200">Brand Consistency</span>
        </div>
        <span className={`text-sm font-bold ${colors.text}`}>{score}/100</span>
      </div>

      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
        />
      </div>

      {breakdown && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
          <div>
            <span className="block text-slate-500">Tone</span>
            <span className="font-semibold text-slate-300">{breakdown.tone || score}%</span>
          </div>
          <div>
            <span className="block text-slate-500">Style</span>
            <span className="font-semibold text-slate-300">{breakdown.style || score}%</span>
          </div>
          <div>
            <span className="block text-slate-500">Vocab</span>
            <span className="font-semibold text-slate-300">{breakdown.vocabulary || score}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
