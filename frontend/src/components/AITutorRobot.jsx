import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, Mic, Brain, Heart } from "lucide-react";

export default function AITutorRobot({ 
  state = "idle", // "idle" | "listening" | "thinking" | "speaking"
  size = "md",   // "sm" | "md" | "lg"
  interactive = true,
  onClick
}) {
  const [blink, setBlink] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    // Natural blinking interval
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const dimensions = {
    sm: "w-24 h-28",
    md: "w-36 h-44",
    lg: "w-48 h-56"
  }[size] || "w-36 h-44";

  return (
    <div 
      className={`relative flex flex-col items-center justify-center select-none ${dimensions} ${interactive ? "cursor-pointer group" : ""}`}
      onClick={() => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1200);
        if (onClick) onClick();
      }}
      title="ADAPTIFY AI Tutor Robot — Click to interact!"
    >
      {/* Floating Aura Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 via-indigo-400/20 to-blue-400/20 blur-2xl group-hover:blur-3xl transition-all animate-pulse-slow pointer-events-none" />

      {/* Robot SVG Avatar */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow under robot */}
        <ellipse cx="100" cy="225" rx="45" ry="10" fill="#CBD5E1" opacity="0.45" />

        {/* Antenna */}
        <line x1="100" y1="45" x2="100" y2="25" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle 
          cx="100" 
          cy="20" 
          r="9" 
          fill="url(#purpleGrad)" 
          className={state === "listening" ? "animate-ping origin-center" : "animate-pulse"} 
        />
        <circle cx="100" cy="20" r="5" fill="#38BDF8" filter="url(#glow)" />

        {/* Ears / Headphone Accents */}
        <rect x="24" y="65" width="14" height="34" rx="7" fill="url(#purpleGrad)" />
        <rect x="162" y="65" width="14" height="34" rx="7" fill="url(#purpleGrad)" />

        {/* Head Base */}
        <rect x="34" y="42" width="132" height="80" rx="30" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />
        
        {/* Face Visor Screen */}
        <rect x="46" y="54" width="108" height="56" rx="20" fill="url(#screenGrad)" />

        {/* Eyes (Visor) */}
        {blink ? (
          // Blinking straight line
          <>
            <line x1="68" y1="82" x2="88" y2="82" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <line x1="112" y1="82" x2="132" y2="82" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : state === "thinking" ? (
          // Thinking spiral / sparkle
          <>
            <circle cx="78" cy="80" r="7" fill="#F59E0B" filter="url(#glow)" />
            <circle cx="122" cy="80" r="7" fill="#F59E0B" filter="url(#glow)" />
          </>
        ) : state === "listening" ? (
          // Sound wave eyes
          <>
            <ellipse cx="78" cy="80" rx="8" ry="12" fill="#10B981" filter="url(#glow)" />
            <ellipse cx="122" cy="80" rx="8" ry="12" fill="#10B981" filter="url(#glow)" />
          </>
        ) : (
          // Friendly glowing curved happy eyes
          <>
            <ellipse cx="78" cy="80" rx="8" ry="11" fill="url(#eyeGrad)" filter="url(#glow)" />
            <ellipse cx="122" cy="80" rx="8" ry="11" fill="url(#eyeGrad)" filter="url(#glow)" />
            {/* Eye light reflections */}
            <circle cx="75" cy="76" r="3" fill="#FFFFFF" />
            <circle cx="119" cy="76" r="3" fill="#FFFFFF" />
          </>
        )}

        {/* Smile */}
        <path
          d={state === "speaking" ? "M 88 98 Q 100 106 112 98 Q 100 94 88 98" : "M 90 98 Q 100 105 110 98"}
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={state === "speaking" ? "#38BDF8" : "none"}
        />

        {/* Neck connector */}
        <rect x="90" y="122" width="20" height="12" rx="4" fill="#94A3B8" />

        {/* Robot Torso / Body */}
        <rect x="48" y="132" width="104" height="74" rx="26" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Chest Display Core */}
        <rect x="68" y="146" width="64" height="42" rx="14" fill="#0F172A" />

        {/* Chest Audio Waveform / Heart Pulse */}
        <rect x="76" y="162" width="4" height="12" rx="2" fill="#818CF8" className="soundwave-bar" />
        <rect x="84" y="156" width="4" height="22" rx="2" fill="#6366F1" className="soundwave-bar" />
        <rect x="92" y="152" width="4" height="28" rx="2" fill="#38BDF8" className="soundwave-bar" />
        <rect x="100" y="154" width="4" height="24" rx="2" fill="#8B5CF6" className="soundwave-bar" />
        <rect x="108" y="160" width="4" height="16" rx="2" fill="#C084FC" className="soundwave-bar" />
        <rect x="116" y="164" width="4" height="9" rx="2" fill="#818CF8" className="soundwave-bar" />

        {/* Left Arm */}
        <g className={isWaving ? "animate-bounce origin-top" : ""}>
          <rect x="22" y="142" width="18" height="44" rx="9" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="31" cy="192" r="8" fill="url(#purpleGrad)" />
        </g>

        {/* Right Arm */}
        <g>
          <rect x="160" y="142" width="18" height="44" rx="9" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="169" cy="192" r="8" fill="url(#purpleGrad)" />
        </g>
      </svg>

      {/* Floating State Badge */}
      <div className="absolute -bottom-2 bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-purple-200/80 shadow-sm flex items-center gap-1.5 text-[11px] font-semibold text-purple-700">
        {state === "listening" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Listening...</span>
          </>
        ) : state === "thinking" ? (
          <>
            <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
            <span>Thinking...</span>
          </>
        ) : state === "speaking" ? (
          <>
            <Volume2 className="w-3 h-3 text-indigo-600 animate-bounce" />
            <span>Explaining...</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AI Tutor Online</span>
          </>
        )}
      </div>
    </div>
  );
}
