import React, { useState } from "react";
import { useBrand } from "../context/BrandContext";
import { Sparkles, ChevronDown, Check, Plus, BrainCircuit } from "lucide-react";

export default function BrandMemoryBadge({ onNavigateToBrandMemory }) {
  const { brandProfiles, activeBrand, selectActiveBrand } = useBrand();
  const [open, setOpen] = useState(false);

  if (!activeBrand) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-800/80 border border-brand-500/30 hover:border-brand-500/60 text-xs font-medium text-slate-200 transition-all shadow-sm"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
        <span className="text-slate-400">Brand Memory:</span>
        <span className="font-semibold text-white max-w-[120px] truncate">
          {activeBrand.brand_name}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-navy-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Switch Brand Profile</span>
              <span className="text-brand-400 text-[10px]">Active Voice</span>
            </div>

            <div className="mt-1 space-y-1 max-h-56 overflow-y-auto">
              {brandProfiles.map((p) => {
                const isActive = p.id === activeBrand.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectActiveBrand(p.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      isActive
                        ? "bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/30"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{p.brand_name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Tone: {p.tone_of_voice || "Authentic"}
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-brand-400 ml-2 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setOpen(false);
                  if (onNavigateToBrandMemory) onNavigateToBrandMemory();
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-400 hover:bg-brand-500/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Manage Brand Memory
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
