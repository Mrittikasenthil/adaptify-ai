import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Mic,
  Volume2,
  Key,
  Check,
  Save,
  Globe,
  Sliders,
  Sparkles,
  Info
} from "lucide-react";
import { api } from "../services/api";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("Alex Mercer");
  const [academicLevel, setAcademicLevel] = useState("Undergraduate Engineering (Year 2)");
  const [preferredStyle, setPreferredStyle] = useState("Exam-oriented explanation");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [wisprApiKey, setWisprApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadWispr() {
      const s = await api.getWisprStatus();
      if (s?.is_configured) {
        setWisprApiKey("••••••••••••••••");
      }
    }
    loadWispr();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (wisprApiKey && !wisprApiKey.startsWith("••••")) {
      try {
        await api.configureWispr(wisprApiKey);
      } catch (err) {
        console.warn("Wispr configure err:", err);
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Account & Learning Environment
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Profile & Study Preferences
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your AI tutor personality, language dialect, and Wispr Flow voice engine.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved Successfully" : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Student Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" /> Student Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Academic Standing</label>
              <input
                type="text"
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>

        {/* AI Tutor Teaching Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> AI Teaching Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Default Explanation Level
              </label>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="Explain like a beginner">🌱 Beginner (Simple Analogies)</option>
                <option value="Simple explanation">💡 Simple Explanation</option>
                <option value="Detailed technical explanation">🔬 Detailed Technical</option>
                <option value="Exam-oriented explanation">🎯 Exam-Oriented (Full Marks Focus)</option>
                <option value="Real-world application">🌍 Real-World Industry Application</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Preferred Explanation Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="English">🌐 English</option>
                <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
                <option value="Tanglish">⚡ Tanglish (Tamil + English)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wispr Flow Integration Settings */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-600" /> Wispr Flow Voice Integration
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              System Dictation Compatible
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>
              <strong>How Wispr Flow works with ADAPTIFY AI:</strong>
            </p>
            <p>
              Wispr Flow is an external high-accuracy dictation app on your computer. When you click into any input field or text area on this site, activate Wispr Flow via your global shortcut, and speak naturally. Your spoken words will flow immediately into the input!
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Optional Wispr Flow Cloud API Key (Bearer Token)
            </label>
            <input
              type="password"
              value={wisprApiKey}
              onChange={(e) => setWisprApiKey(e.target.value)}
              placeholder="Paste Wispr Flow API key if using cloud endpoint..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-mono"
            />
            <p className="text-[10px] text-slate-400">
              If left blank, ADAPTIFY AI automatically supports browser speech input fallback and native device dictation.
            </p>
          </div>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-600" /> Google Gemini AI Model
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Gemini API Key
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-mono"
            />
            <p className="text-[10px] text-slate-400">
              Optional. When omitted, ADAPTIFY AI seamlessly runs using its high-fidelity built-in contextual engineering tutor engine.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
