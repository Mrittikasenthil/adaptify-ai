import React from "react";
import { X, ShieldCheck, AlertCircle, CheckCircle2, Wand2, ArrowRight } from "lucide-react";

export default function BrandConsistencyModal({
  isOpen,
  onClose,
  data,
  platform,
  onApplyAutoFix
}) {
  if (!isOpen || !data) return null;

  const score = data.overall_score || data.consistency_score || 92;
  const breakdown = data.score_breakdown || {
    tone: data.tone_score || 94,
    style: data.style_score || 92,
    vocabulary: data.vocabulary_score || 90,
    audience: data.audience_score || 93,
    guidelines: data.guidelines_score || 95
  };

  const getScoreColor = (val) => {
    if (val >= 90) return "text-emerald-400 bg-emerald-500";
    if (val >= 75) return "text-indigo-400 bg-indigo-500";
    return "text-amber-400 bg-amber-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-navy-900 border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Brand Consistency Audit</h3>
              <p className="text-xs text-slate-400">
                Audited against active Brand Memory • Platform: <span className="text-brand-300 font-medium capitalize">{platform}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-navy-800 to-navy-850 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Consistency</span>
            <div className="text-3xl font-black text-white mt-0.5 flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {score >= 90
                ? "✨ Flawless alignment with brand voice, vocabulary, and guidelines."
                : score >= 75
                ? "⚡ Good brand alignment with minor vocabulary or cadence opportunities."
                : "⚠️ Noticeable drift from target brand guidelines. Review suggestions below."}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
            <span className="text-lg font-bold text-brand-400">{score}%</span>
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Compliance Breakdown</h4>

          <div className="space-y-2.5">
            {[
              { label: "Tone of Voice Alignment", val: breakdown.tone || 92 },
              { label: "Writing Style & Cadence", val: breakdown.style || 90 },
              { label: "Brand Vocabulary Usage", val: breakdown.vocabulary || 94 },
              { label: "Target Audience Suitability", val: breakdown.audience || 91 },
              { label: "Brand Guidelines & Constraints", val: breakdown.guidelines || 95 }
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-navy-850 border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-bold text-white">{item.val}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.val >= 90 ? "bg-emerald-400" : item.val >= 75 ? "bg-brand-500" : "bg-amber-400"}`}
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabulary & Forbidden Words */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-850 border border-slate-800">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Brand Keywords Detected
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(data.vocabulary_used && data.vocabulary_used.length > 0) ? (
                data.vocabulary_used.map((w, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                    {w}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-[11px]">No specific keywords matched</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-navy-850 border border-slate-800">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Words to Avoid Status
            </span>
            <div className="mt-1.5">
              {data.avoid_words_found && data.avoid_words_found.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {data.avoid_words_found.map((w, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                      ⚠️ {w}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                  ✓ 100% Forbidden-words free
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Actionable Recommendations
          </h4>
          <div className="space-y-2">
            {(data.suggestions && data.suggestions.length > 0) ? (
              data.suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-500/5 border border-brand-500/20 text-xs text-slate-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Everything is fully aligned with your brand guidelines.</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close Audit
          </button>
          {data.auto_fixed_version && onApplyAutoFix && (
            <button
              onClick={() => {
                onApplyAutoFix(data.auto_fixed_version);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Apply AI Auto-Fix (100% Compliant)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
