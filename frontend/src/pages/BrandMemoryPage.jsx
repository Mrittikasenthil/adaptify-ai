import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Save,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Tag,
  Palette,
  FileText,
  Volume2,
  Users,
  Compass,
  Loader2,
  HelpCircle,
  Layers,
  Share2,
  Cpu,
  Zap,
  Target
} from "lucide-react";
import { useBrand } from "../context/BrandContext";
import { api } from "../services/api";

export default function BrandMemoryPage() {
  const { brandProfiles, activeBrand, refreshBrands, selectActiveBrand } = useBrand();

  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [formData, setFormData] = useState({
    brand_name: "",
    description: "",
    industry: "",
    target_audience: "",
    brand_personality: "",
    tone_of_voice: "",
    writing_style: "",
    preferred_vocabulary: "",
    words_to_avoid: "",
    brand_guidelines: "",
    brand_colors: "#6366F1, #3B82F6, #06B6D4",
    sample_content: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [testText, setTestText] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (activeBrand && !selectedProfileId) {
      setSelectedProfileId(activeBrand.id);
      loadProfileData(activeBrand);
    } else if (brandProfiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(brandProfiles[0].id);
      loadProfileData(brandProfiles[0]);
    }
  }, [activeBrand, brandProfiles]);

  const loadProfileData = (profile) => {
    setFormData({
      brand_name: profile.brand_name || "",
      description: profile.description || "",
      industry: profile.industry || "",
      target_audience: profile.target_audience || "",
      brand_personality: profile.brand_personality || "",
      tone_of_voice: profile.tone_of_voice || "",
      writing_style: profile.writing_style || "",
      preferred_vocabulary: profile.preferred_vocabulary || "",
      words_to_avoid: profile.words_to_avoid || "",
      brand_guidelines: profile.brand_guidelines || "",
      brand_colors: profile.brand_colors || "#6366F1, #3B82F6, #06B6D4",
      sample_content: profile.sample_content || ""
    });
    setTestResult(null);
  };

  const handleSelectProfile = (id) => {
    setSelectedProfileId(id);
    const p = brandProfiles.find((item) => item.id === id);
    if (p) loadProfileData(p);
  };

  const handleCreateNewProfile = () => {
    setSelectedProfileId("new");
    setFormData({
      brand_name: "CyberPulse Security",
      description: "Zero-trust cybersecurity intelligence for enterprise cloud systems.",
      industry: "Cybersecurity & Cloud",
      target_audience: "CISOs, SecOps teams, and cloud security architects",
      brand_personality: "Vigilant, authoritative, sharp, mission-critical",
      tone_of_voice: "Uncompromising, direct, urgent yet deeply reassuring",
      writing_style: "Data-backed risk frameworks, concise tactical steps, zero fluff",
      preferred_vocabulary: "zero-trust, telemetry, attack surface, posture, resilience, air-gap",
      words_to_avoid: "cheap, easy, hack, magic, revolutionary",
      brand_guidelines: "Never downplay threats. Present clear, actionable containment protocols.",
      brand_colors: "#0F172A, #EF4444, #10B981",
      sample_content: "Perimeters do not stop modern adversaries; continuous identity verification does."
    });
    setMessage({ type: "info", text: "Fill in the brand details below and click 'Save Brand Memory'." });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (selectedProfileId === "new") {
        const created = await api.createBrandProfile({
          ...formData,
          is_active: brandProfiles.length === 0
        });
        await refreshBrands();
        setSelectedProfileId(created.id);
        setMessage({ type: "success", text: `Brand Memory '${formData.brand_name}' created successfully!` });
      } else {
        await api.updateBrandProfile(selectedProfileId, formData);
        await refreshBrands();
        setMessage({ type: "success", text: "Brand Memory updated and synced persistently!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedProfileId || selectedProfileId === "new") return;
    try {
      await api.activateBrandProfile(selectedProfileId);
      await refreshBrands();
      setMessage({ type: "success", text: `'${formData.brand_name}' is now your ACTIVE Brand Memory!` });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to activate profile." });
    }
  };

  const handleDelete = async () => {
    if (!selectedProfileId || selectedProfileId === "new") return;
    if (!confirm(`Are you sure you want to delete '${formData.brand_name}'?`)) return;
    try {
      await api.deleteBrandProfile(selectedProfileId);
      await refreshBrands();
      if (brandProfiles.length > 1) {
        const remaining = brandProfiles.filter((p) => p.id !== selectedProfileId);
        setSelectedProfileId(remaining[0].id);
        loadProfileData(remaining[0]);
      } else {
        handleCreateNewProfile();
      }
      setMessage({ type: "success", text: "Brand profile deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete profile." });
    }
  };

  const handleTestConsistency = async () => {
    if (!testText.trim()) return;
    setTesting(true);
    try {
      const res = await api.evaluateConsistency({
        content_text: testText,
        platform: "general",
        brand_profile_id: selectedProfileId !== "new" ? selectedProfileId : null
      });
      setTestResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  const isCurrentActive = activeBrand?.id === selectedProfileId;

  // Preset tones
  const tonePresets = [
    "Authoritative & Visionary",
    "Casual & Conversational",
    "Witty & Clever",
    "Urgent & High-Energy",
    "Gentle & Empathetic",
    "Technical & Data-Driven"
  ];

  const colorList = formData.brand_colors
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.startsWith("#") || c.startsWith("rgb"));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300 mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
            <span>Persistent Brand Memory DNA</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Brand DNA Vault</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            This persistent memory engine enforces your voice, vocabulary rules, and guidelines automatically across every generated asset.
          </p>
        </div>

        {/* Profile Switcher & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCreateNewProfile}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            <span>New Brand</span>
          </button>

          {!isCurrentActive && selectedProfileId !== "new" && (
            <button
              onClick={handleActivate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Set as Active Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Brand Profile Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {brandProfiles.map((p) => {
          const isSelected = selectedProfileId === p.id;
          const isActive = p.is_active;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectProfile(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-navy-850 border-2 border-brand-500 text-white shadow-md shadow-brand-500/10"
                  : "bg-navy-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span>{p.brand_name}</span>
              {isActive && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              )}
            </button>
          );
        })}

        {selectedProfileId === "new" && (
          <span className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-brand-600/20 text-brand-300 border border-brand-500/40">
            ✨ Creating New Brand...
          </span>
        )}
      </div>

      {/* Brand DNA Relationship Visualization Diagram */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-brand-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Brand DNA Interconnected Relationship Map
            </h3>
          </div>
          <span className="text-[10px] text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20 font-bold">
            Live Cognitive Synapse
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">Node 1: Identity</span>
            <div className="font-bold text-xs text-white truncate">{formData.brand_name || "Apex Cloud"}</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{formData.industry || "Software"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Node 2: Tone & Cadence</span>
            <div className="font-bold text-xs text-white truncate">{formData.tone_of_voice || "Authoritative"}</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{formData.writing_style || "Concise"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">Node 3: Target Persona</span>
            <div className="font-bold text-xs text-white truncate">{formData.target_audience || "Engineering Leaders"}</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">High-Value Enterprise</div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Node 4: Guardrail Rules</span>
            <div className="font-bold text-xs text-white truncate">100% Anti-Buzzword</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">Zero Forbidden Terms</div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : message.type === "error"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : "bg-brand-500/10 border-brand-500/30 text-brand-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="font-semibold">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Grid: Form Editor & Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* The Brand Memory Profile Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {/* Section 1: Core Identity */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Compass className="w-4 h-4" /> 1. Brand Identity & Industry
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Apex Cloud, EcoVibe Living"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. B2B SaaS, Health & Wellness"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 resize-none font-sans"
                placeholder="Briefly describe what your brand does and its core mission..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                placeholder="e.g. Engineering leaders, CTOs, conscious millennial homeowners"
              />
            </div>
          </div>

          {/* Section 2: Tone & Voice Rules */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Volume2 className="w-4 h-4" /> 2. Voice, Tone & Writing Style
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Personality</label>
                <input
                  type="text"
                  value={formData.brand_personality}
                  onChange={(e) => setFormData({ ...formData, brand_personality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Authoritative, sleek, developer-obsessed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Writing Style</label>
                <input
                  type="text"
                  value={formData.writing_style}
                  onChange={(e) => setFormData({ ...formData, writing_style: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Concise bullets, data-backed assertions, zero fluff"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Tone of Voice</label>
              <input
                type="text"
                value={formData.tone_of_voice}
                onChange={(e) => setFormData({ ...formData, tone_of_voice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                placeholder="e.g. Visionary, direct, intellectually honest"
              />

              {/* Tone Quick Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tonePresets.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone_of_voice: t })}
                    className="px-2 py-1 rounded-lg bg-navy-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Vocabulary & Forbidden Words */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Tag className="w-4 h-4" /> 3. Vocabulary Control & Forbidden Words
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Vocabulary / Brand Keywords (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={formData.preferred_vocabulary}
                onChange={(e) => setFormData({ ...formData, preferred_vocabulary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-sans"
                placeholder="e.g. telemetry, velocity, compounding, resilience, architectural moat"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Keywords and phrases the AI will strategically weave into generated headlines and body copy.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Words to Avoid / Forbidden Buzzwords (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={formData.words_to_avoid}
                onChange={(e) => setFormData({ ...formData, words_to_avoid: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-rose-900/60 text-xs text-rose-100 focus:outline-none focus:border-rose-500 font-sans"
                placeholder="e.g. synergy, game changer, revolutionize, rockstar, ninja, cheap"
              />
              <p className="text-[10px] text-rose-400/80 mt-1">
                ⚠️ Strict constraint: The AI will strictly penalize and exclude any of these forbidden words.
              </p>
            </div>
          </div>

          {/* Section 4: Brand Guidelines, Visual Colors & Sample Content */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-brand-400">
              <FileText className="w-4 h-4" /> 4. Guidelines, Colors & Few-Shot Samples
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand Colors (Hex values, e.g. #6366F1, #3B82F6)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.brand_colors}
                  onChange={(e) => setFormData({ ...formData, brand_colors: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="#6366F1, #3B82F6, #06B6D4"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {colorList.map((hex, idx) => (
                    <span
                      key={idx}
                      className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand Guidelines & Rules
              </label>
              <textarea
                rows={3}
                value={formData.brand_guidelines}
                onChange={(e) => setFormData({ ...formData, brand_guidelines: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-sans"
                placeholder="e.g. Always lead with measurable impact. Never use hyperbolic claims. Respect reader attention."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sample Previous Content (Few-Shot Demonstration)
              </label>
              <textarea
                rows={4}
                value={formData.sample_content}
                onChange={(e) => setFormData({ ...formData, sample_content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                placeholder="Paste an excerpt of a high-performing post or article that represents your exact voice..."
              />
              <p className="text-[10px] text-slate-500 mt-1">
                The AI analyzes this sample text to emulate your sentence cadence and cadence structure.
              </p>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="p-5 rounded-3xl bg-navy-900 border border-slate-800 flex items-center justify-between">
            {selectedProfileId !== "new" && brandProfiles.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Profile</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-purple hover:from-brand-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{selectedProfileId === "new" ? "Create Brand Memory" : "Save Changes"}</span>
            </button>
          </div>
        </form>

        {/* Live Brand Consistency Simulator */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="p-6 rounded-3xl bg-navy-900 border border-brand-500/30 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-brand-400">
              <ShieldCheck className="w-4 h-4" /> Live Memory Audit Simulator
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Test how the AI evaluates content against this Brand Memory profile. Type or paste a draft below to audit compliance in real-time.
            </p>

            <textarea
              rows={4}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="mt-3 w-full p-3.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-sans"
              placeholder="e.g. We provide game changer cloud solutions to unlock synergy and compound velocity..."
            />

            <button
              type="button"
              disabled={testing || !testText.trim()}
              onClick={handleTestConsistency}
              className="mt-3 w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Test Against Brand Memory</span>
            </button>

            {testResult && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Brand Match Score</span>
                  <span className={`text-base font-extrabold ${testResult.overall_score >= 85 ? "text-emerald-400" : "text-amber-400"}`}>
                    {testResult.overall_score}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${testResult.overall_score >= 85 ? "bg-emerald-400" : "bg-amber-400"}`}
                    style={{ width: `${testResult.overall_score}%` }}
                  />
                </div>

                {testResult.avoid_words_found?.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300">
                    <span className="font-bold">⚠️ Forbidden words flagged:</span> {testResult.avoid_words_found.join(", ")}
                  </div>
                )}

                {testResult.vocabulary_used?.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                    <span className="font-bold">✓ Keywords matched:</span> {testResult.vocabulary_used.join(", ")}
                  </div>
                )}

                {testResult.suggestions?.length > 0 && (
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Suggestions:</span>
                    {testResult.suggestions.map((s, i) => (
                      <p key={i}>• {s}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
