import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Send,
  Trash2,
  Sparkles,
  HelpCircle,
  Radio,
  Sliders,
  X,
  ExternalLink,
  CheckCircle2,
  Info
} from "lucide-react";
import AITutorRobot from "./AITutorRobot";

export default function VoiceTutorModal({
  isOpen,
  onClose,
  activeContext = "",
  onAskQuestion,
  initialQuestion = ""
}) {
  const [inputText, setInputText] = useState(initialQuestion);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your ADAPTIFY AI Voice Tutor. You can dictate questions using Wispr Flow directly into this field, or use our browser speech fallback. What would you like to master today?",
      timestamp: "Just now"
    }
  ]);

  // Voice Interaction States: "ready" | "listening" | "transcribing" | "processing" | "responding"
  const [voiceState, setVoiceState] = useState("ready");
  const [isBrowserListening, setIsBrowserListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // "English" | "Tamil" | "Tanglish"
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);
  const currentUtteranceRef = useRef(null);
  const inputRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Initialize Speech Recognition & TTS voices
  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === "Tamil" ? "ta-IN" : "en-US";

      recognition.onstart = () => {
        setIsBrowserListening(true);
        setVoiceState("listening");
      };

      recognition.onresult = (event) => {
        setVoiceState("transcribing");
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const newText = finalTranscript || interimTranscript;
        if (newText) {
          setInputText((prev) => (prev ? `${prev} ${newText}` : newText));
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsBrowserListening(false);
        setVoiceState("ready");
      };

      recognition.onend = () => {
        setIsBrowserListening(false);
        if (voiceState === "listening" || voiceState === "transcribing") {
          setVoiceState("ready");
        }
      };

      recognitionRef.current = recognition;
    }

    // Load Web Speech Synthesis voices
    if (synthRef.current) {
      const updateVoices = () => {
        const available = synthRef.current.getVoices();
        setVoices(available);
        if (available.length > 0 && !selectedVoice) {
          // Select default English or regional voice
          const defaultV = available.find(v => v.lang.startsWith("en")) || available[0];
          setSelectedVoice(defaultV);
        }
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedLanguage]);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, voiceState]);

  if (!isOpen) return null;

  // Toggle Browser Speech Recognition
  const toggleBrowserListening = () => {
    if (!recognitionRef.current) return;
    if (isBrowserListening) {
      recognitionRef.current.stop();
      setIsBrowserListening(false);
      setVoiceState("ready");
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  // Submit Spoken / Typed Question
  const handleSendQuestion = async () => {
    if (!inputText.trim()) return;

    const userQ = inputText.trim();
    setInputText("");
    if (isBrowserListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Add user message
    setConversation((prev) => [
      ...prev,
      { role: "user", content: userQ, timestamp: "Just now" }
    ]);

    setVoiceState("processing");

    try {
      let replyText = "";
      if (onAskQuestion) {
        const res = await onAskQuestion(userQ, selectedLanguage);
        replyText = res.answer || res;
      } else {
        replyText = `Regarding "${userQ}": In the active study material, the core mechanism relies on balancing boundary invariants, minimizing waiting states, and ensuring state consistency. You can review the formulas in the Notes tab!`;
      }

      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: replyText, timestamp: "Just now" }
      ]);
      setVoiceState("responding");

      // Auto speak response
      speakText(replyText);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered an issue processing that. Please try asking again!", timestamp: "Just now" }
      ]);
      setVoiceState("ready");
    }
  };

  // TTS Controls
  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Clean markdown hashes/stars for clear speech
    const cleanSpeech = text
      .replace(/[#*`_~]/g, "")
      .replace(/\[.*?\]/g, "")
      .slice(0, 500); // speak first 500 characters for concise spoken answers

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = speechRate;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setVoiceState("responding");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setVoiceState("ready");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setVoiceState("ready");
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handlePause = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setVoiceState("ready");
    }
  };

  const handleReplayLast = () => {
    const lastAssistantMsg = [...conversation].reverse().find(m => m.role === "assistant");
    if (lastAssistantMsg) {
      speakText(lastAssistantMsg.content);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Talk to ADAPTIFY AI
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Wispr Flow Compatible
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Dictate naturally with Wispr Flow or browser voice input • Listen to AI spoken responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              <option value="English">🌐 English</option>
              <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
              <option value="Tanglish">⚡ Tanglish (Tamil + English)</option>
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wispr Flow Integration Notification Banner */}
        <div className="bg-gradient-to-r from-purple-600/5 via-indigo-600/5 to-blue-600/5 px-6 py-2.5 border-b border-purple-100/60 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span>
              <strong>Wispr Flow Active Workflow:</strong> Click inside the text box below and trigger your Wispr Flow shortcut to dictate.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-purple-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            Target Field Auto-Focused
          </span>
        </div>

        {/* Main Body: Multi-column or Stacked Layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF9FF]">
          
          {/* Left Column: Robot + Voice Status Waveform (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-between bg-white rounded-2xl p-5 border border-purple-100/80 shadow-sm text-center">
            
            {/* Robot Avatar */}
            <div className="py-2">
              <AITutorRobot 
                state={voiceState === "responding" ? "speaking" : voiceState === "listening" ? "listening" : voiceState === "processing" ? "thinking" : "idle"}
                size="md" 
              />
            </div>

            {/* Current State Indicator Badge */}
            <div className="w-full my-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {voiceState === "ready" && "🟢 1. Ready to Listen"}
                {voiceState === "listening" && "🎙️ 2. Listening to Speech..."}
                {voiceState === "transcribing" && "✍️ 3. Transcribing Spoken Words..."}
                {voiceState === "processing" && "🧠 4. AI Processing Answer..."}
                {voiceState === "responding" && "🔊 5. AI Speaking Response..."}
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="w-full bg-purple-50/70 rounded-xl p-3 border border-purple-100 flex flex-col items-center gap-2">
              <div className="h-8 flex items-center justify-center gap-1.5 w-full">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      voiceState === "listening" || voiceState === "responding"
                        ? "bg-purple-600 soundwave-bar"
                        : "bg-purple-200 h-2"
                    }`}
                    style={{
                      animationDelay: `${(i % 5) * 0.12}s`,
                      height: voiceState === "listening" || voiceState === "responding" ? undefined : "6px"
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {voiceState === "listening" ? "Capturing voice stream..." : voiceState === "responding" ? "Speaking via Web Speech API" : "Voice channel standby"}
              </span>
            </div>

            {/* Browser Speech Fallback Button (clearly separated from Wispr Flow) */}
            <div className="w-full mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={toggleBrowserListening}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  isBrowserListening
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md animate-pulse"
                    : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                }`}
              >
                {isBrowserListening ? (
                  <>
                    <MicOff className="w-4 h-4" /> Stop Browser Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" /> Start Browser Speech Fallback
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400">
                Native Web Speech API fallback. Wispr Flow users can dictate directly into the text box anytime.
              </p>
            </div>
          </div>

          {/* Right Column: Chat History + Focused Dictation Box (8 cols) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white rounded-2xl p-4 border border-purple-100/80 shadow-sm">
            
            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[320px] min-h-[220px]">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-sm"
                        : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {/* Read Aloud button for AI response */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-[11px] text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 hover:underline"
                      >
                        <Volume2 className="w-3 h-3" /> Read Aloud
                      </button>
                      <span className="text-[10px] text-slate-400">• {msg.timestamp}</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Audio Speech Controls Bar */}
            <div className="py-2.5 px-3 bg-purple-50/50 rounded-xl my-2 border border-purple-100/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600 text-[11px]">AI Speech Controls:</span>
                {isSpeaking && !isPaused ? (
                  <button
                    onClick={handlePause}
                    className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
                    title="Pause Speech"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={handleResume}
                    className="p-1.5 rounded-lg bg-white border border-purple-200 text-emerald-600 hover:bg-emerald-50"
                    title="Resume Speech"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                ) : null}

                <button
                  onClick={handleStop}
                  disabled={!isSpeaking && !isPaused}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  title="Stop Speech"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleReplayLast}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
                  title="Replay Last Answer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] text-slate-500 font-medium">Speed:</span>
                {[0.8, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeechRate(speed)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      speechRate === speed
                        ? "bg-purple-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Focused Wispr Flow Compatible Text Area */}
            <div className="mt-1 flex flex-col gap-2">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendQuestion();
                    }
                  }}
                  placeholder="Focus here & dictate with Wispr Flow, or type your question..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 bg-purple-50/20 text-slate-800 placeholder-slate-400 resize-none transition-all"
                />

                {/* Floating Wispr Flow ready indicator */}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-purple-200 shadow-xs text-[10px] font-medium text-purple-600">
                  <Mic className="w-3 h-3 text-purple-600" />
                  Wispr Flow Ready
                </div>
              </div>

              {/* Action Buttons: Ask AI & Clear */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setInputText("")}
                  disabled={!inputText}
                  className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-30 flex items-center gap-1 font-medium px-2 py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendQuestion}
                    disabled={!inputText.trim() || voiceState === "processing"}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {voiceState === "processing" ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Thinking...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Ask AI Tutor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer with Quick Instructions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-purple-600" />
            <span>
              Tip: Press <strong>Enter</strong> to send your question. Supports English, Tamil, and Tanglish explanations!
            </span>
          </div>

          <button
            onClick={() => setInputText("Explain this topic in simple words like I am 5 years old")}
            className="text-purple-600 hover:underline font-medium"
          >
            Try: "Explain in simple words"
          </button>
        </div>

      </div>
    </div>
  );
}
