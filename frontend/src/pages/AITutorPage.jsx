import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Copy,
  Trash2,
  Check,
  Languages,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import AITutorRobot from "../components/AITutorRobot";
import { api } from "../services/api";

export default function AITutorPage({
  selectedMaterial,
  onOpenVoiceModal
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your dedicated AI Exam-Prep Tutor. I'm currently tuned into "${selectedMaterial?.title || 'Engineering Concepts'}". You can ask for 16-mark essay structures, simple analogies, or even summaries in Tanglish!`,
      time: "Just now"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState("Simple explanation");
  const [language, setLanguage] = useState("English");
  const [useDocContext, setUseDocContext] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Audio Speech state
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const synthRef = useRef(window.speechSynthesis || null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnswering]);

  const handleSendMessage = async (textToSend = inputVal) => {
    const q = (textToSend || "").trim();
    if (!q) return;

    setInputVal("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q, time: "Just now" }
    ]);
    setIsAnswering(true);

    try {
      const docCtx = useDocContext && selectedMaterial ? selectedMaterial.title : "";
      const res = await api.askTutor(q, docCtx, explanationLevel, language);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, time: "Just now" }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Could not retrieve answer. Please try again!", time: "Just now" }
      ]);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleSpeak = (text, idx) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (speakingIdx === idx) {
      setSpeakingIdx(null);
      return;
    }

    const clean = text.replace(/[#*`_~]/g, "").slice(0, 600);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.onend = () => setSpeakingIdx(null);
    utter.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    synthRef.current.speak(utter);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const samplePrompts = [
    "Explain this topic in simple words",
    "What are the important exam questions?",
    "Generate 10 MCQs from this chapter",
    "Explain this diagram",
    "Give me 16-mark exam answers",
    "Summarize this topic in Tanglish"
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner with Explanation Level & Language Selectors */}
      <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              ADAPTIFY AI Tutor Studio
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Active
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Target Material: <strong>{selectedMaterial?.title || "Engineering Principles"}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Explanation Level */}
          <select
            value={explanationLevel}
            onChange={(e) => setExplanationLevel(e.target.value)}
            className="text-xs bg-purple-50/60 border border-purple-200/80 rounded-xl px-3 py-1.5 font-semibold text-purple-800 focus:outline-none"
          >
            <option value="Explain like a beginner">🌱 Beginner (Analogies)</option>
            <option value="Simple explanation">💡 Simple Explanation</option>
            <option value="Detailed technical explanation">🔬 Detailed Technical</option>
            <option value="Exam-oriented explanation">🎯 Exam-Oriented (Full Marks)</option>
            <option value="Real-world application">🌍 Real-World Application</option>
          </select>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-white border border-purple-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="English">🌐 English</option>
            <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
            <option value="Tanglish">⚡ Tanglish (Tamil + English)</option>
          </select>

          {/* Document Context Toggle */}
          <button
            onClick={() => setUseDocContext(!useDocContext)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              useDocContext
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
          >
            {useDocContext ? "📄 Doc Context ON" : "🌐 General AI"}
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden flex flex-col h-[540px]">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-4 rounded-3xl leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-sm"
                    : "bg-purple-50/50 border border-purple-100/80 text-slate-800 rounded-tl-none shadow-2xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.role === "assistant" && (
                  <div className="mt-3 pt-2 border-t border-purple-200/40 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSpeak(m.content, idx)}
                        className="hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        {speakingIdx === idx ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-purple-600" />}
                        {speakingIdx === idx ? "Stop Audio" : "Listen (TTS)"}
                      </button>

                      <button
                        onClick={() => handleCopy(m.content, idx)}
                        className="hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIdx === idx ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnswering && (
            <div className="flex items-center gap-2 text-xs text-purple-600 font-semibold pl-11">
              <Sparkles className="w-4 h-4 animate-spin" />
              AI Tutor is adapting explanation...
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-purple-100/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold uppercase shrink-0">Try:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 rounded-full bg-white hover:bg-purple-100 border border-slate-200 text-slate-700 hover:text-purple-800 font-medium whitespace-nowrap transition-all shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Area (Wispr Flow Compatible) */}
        <div className="p-4 bg-white border-t border-purple-100">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Focus here & dictate with Wispr Flow, or type your question..."
              className="w-full text-xs sm:text-sm pl-4 pr-24 py-3 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 bg-purple-50/20 text-slate-800 placeholder-slate-400 transition-all"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                onClick={onOpenVoiceModal}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                title="Open Voice Studio"
              >
                <Mic className="w-4 h-4 animate-pulse" />
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim() || isAnswering}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Wispr Flow dictation inserts speech directly into this field. Press Enter to ask.
          </p>
        </div>

      </div>

    </div>
  );
}
