import React, { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  FileQuestion,
  Mail,
  ExternalLink,
  CheckCircle2,
  Send,
  Zap,
  Sparkles
} from "lucide-react";

export default function HelpSupportPage() {
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const guides = [
    {
      title: "Setting Up Your First Brand Memory",
      category: "Quickstart",
      readTime: "3 min read",
      desc: "Learn how to define your brand personality, tone of voice, preferred keywords, and words to avoid to maximize AI consistency."
    },
    {
      title: "Best Practices for Podcast & Video Uploads",
      category: "Media Ingestion",
      readTime: "4 min read",
      desc: "How to extract high-accuracy speech transcripts from MP3, WAV, and MP4 files and polish them for social repurposing."
    },
    {
      title: "Mastering the Brand Consistency Radar (0-100)",
      category: "Quality Assurance",
      readTime: "5 min read",
      desc: "Understand how the 5 consistency dimensions work and how to utilize the 1-Click AI Auto-Fix to ensure 100% compliance."
    },
    {
      title: "Connecting Your Google Gemini API Key",
      category: "Integrations",
      readTime: "2 min read",
      desc: "Step-by-step instructions for adding your Google Gemini API key or leveraging our built-in Contextual Brand Engine."
    }
  ];

  const handleSendTicket = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Documentation & Customer Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          How Can We <span className="gradient-text">Help You Scale</span> Today?
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore quickstart guides, best practice tutorials, or message our product engineering team directly.
        </p>
      </div>

      {/* Quick Documentation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((g, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-navy-900 border border-slate-800 hover:border-brand-500/40 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-bold text-[10px]">
                  {g.category}
                </span>
                <span className="text-slate-500 text-[11px]">{g.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                {g.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{g.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-xs font-bold text-brand-400 group-hover:translate-x-1 transition-transform">
              <span>Read Guide</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* Direct Contact Support Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 shadow-2xl max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Ask a Product Specialist</h3>
            <p className="text-xs text-slate-400">Average response time: &lt; 15 minutes</p>
          </div>
        </div>

        {ticketSent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Thank you! Your inquiry has been received. Our team will get back to you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSendTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Question or Feature Request</label>
              <textarea
                required
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 resize-none font-sans"
                placeholder="Describe your issue or ask for workflow optimization advice..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message to Support</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
