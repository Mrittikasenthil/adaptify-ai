import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Video,
  Presentation,
  FileText,
  FileCode,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Eye,
  AlertCircle
} from "lucide-react";
import { api } from "../services/api";

export default function UploadMaterialsPage({
  materials = [],
  selectedMaterial,
  onSelectMaterial,
  onUploadSuccess,
  onDeleteMaterial,
  onNavigateNotes
}) {
  const [uploadType, setUploadType] = useState("pdf");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadProgress(20);
      setUploadStage("1. Uploading file to secure server...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_type_hint", uploadType);

      try {
        setTimeout(() => { setUploadProgress(45); setUploadStage("2. Extracting text, math & diagrams..."); }, 400);
        setTimeout(() => { setUploadProgress(75); setUploadStage("3. Analysing syllabus structure..."); }, 800);
        setTimeout(() => { setUploadProgress(95); setUploadStage("4. Generating 12-part study notes..."); }, 1200);

        const res = await api.uploadMaterial(formData);
        setUploadProgress(100);
        setUploadStage("5. Completed! Resources ready.");

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStage("");
          if (onUploadSuccess) onUploadSuccess(res.material);
        }, 600);
      } catch (err) {
        alert("Upload error: " + err.message);
        setIsUploading(false);
      }
    }
  };

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setIsUploading(true);
    setUploadProgress(25);
    setUploadStage("1. Contacting YouTube transcript engine...");

    const formData = new FormData();
    formData.append("youtube_url", youtubeUrl.trim());
    formData.append("file_type_hint", "video");

    try {
      setTimeout(() => { setUploadProgress(60); setUploadStage("2. Extracting lecture dialogue..."); }, 500);
      setTimeout(() => { setUploadProgress(90); setUploadStage("3. Generating structured notes..."); }, 900);

      const res = await api.uploadMaterial(formData);
      setUploadProgress(100);
      setUploadStage("Completed!");
      setYoutubeUrl("");

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStage("");
        if (onUploadSuccess) onUploadSuccess(res.material);
      }, 500);
    } catch (err) {
      alert("YouTube error: " + err.message);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this study material?")) return;
    try {
      await api.deleteMaterial(id);
      if (onDeleteMaterial) onDeleteMaterial(id);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Multimodal Document Ingestion
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Smart Document Upload & Content Extraction
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload PDFs, PPTs, videos or diagrams to automatically extract formulas and generate adaptive study materials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {materials.length} Materials Active
          </span>
        </div>
      </div>

      {/* Main Upload Control Card */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
        
        {/* Upload Format Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "pdf", label: "PDF Document", desc: "PDF books, lecture handouts", icon: FileText },
            { id: "ppt", label: "PPT Presentation", desc: "PowerPoint .pptx, .ppt", icon: Presentation },
            { id: "video", label: "Video Lecture", desc: "MP4, MOV, YouTube URLs", icon: Video },
            { id: "image", label: "Diagram / Image", desc: "Handwritten notes, diagrams", icon: FileCode }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = uploadType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setUploadType(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
                    : "bg-[#FAF9FF] hover:bg-purple-50/50 border-purple-100 text-slate-700"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-white" : "text-purple-600"}`} />
                <h4 className="text-xs font-bold">{item.label}</h4>
                <p className={`text-[10px] mt-0.5 ${isSelected ? "text-purple-100" : "text-slate-400"}`}>
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Drag and Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-10 rounded-3xl border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 hover:bg-purple-50/40 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={uploadType === "video" ? "video/*" : uploadType === "ppt" ? ".ppt,.pptx" : uploadType === "pdf" ? ".pdf" : "image/*"}
          />
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Drag & drop your {uploadType.toUpperCase()} file here, or click to browse
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports real text extraction using <code>pypdf</code>, video speech transcription and presentation parsing.
            </p>
          </div>
        </div>

        {/* YouTube input if video selected */}
        {uploadType === "video" && (
          <form onSubmit={handleYoutubeSubmit} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-purple-900 shrink-0">
              YouTube Video Link:
            </span>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube lecture URL (e.g. https://www.youtube.com/watch?v=...)"
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
            />
            <button
              type="submit"
              disabled={!youtubeUrl.trim() || isUploading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all disabled:opacity-40"
            >
              Import & Extract
            </button>
          </form>
        )}

        {/* Live Processing Pipeline Bar */}
        {isUploading && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                {uploadStage}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Uploaded Materials List & Previews */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Uploaded Study Materials Archive
          </h3>
          <span className="text-xs text-slate-400">
            Click any document to load into the AI Tutor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => {
            const isSelected = selectedMaterial?.id === m.id;
            const isVideo = m.file_type === "video";
            const isPPT = m.file_type === "ppt";

            return (
              <div
                key={m.id}
                onClick={() => onSelectMaterial(m.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-purple-50/70 border-purple-500 shadow-xs"
                    : "bg-[#FAF9FF] hover:bg-purple-50/30 border-purple-100"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isVideo
                          ? "bg-rose-100 text-rose-600"
                          : isPPT
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isVideo ? <Video className="w-5 h-5" /> : isPPT ? <Presentation className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Processed
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {m.extracted_text}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{m.duration_or_pages}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMaterial(m);
                      }}
                      className="p-1 rounded-lg hover:bg-purple-100 text-slate-600 hover:text-purple-700"
                      title="Inspect extracted text"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {!m.is_sample && (
                      <button
                        onClick={(e) => handleDelete(m.id, e)}
                        className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="Delete material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Text Inspector Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[80vh] flex flex-col space-y-4 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Extracted Content: {previewMaterial.title}
              </h3>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-purple-50/30 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
              {previewMaterial.extracted_text}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  onSelectMaterial(previewMaterial.id);
                  setPreviewMaterial(null);
                  if (onNavigateNotes) onNavigateNotes();
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                Open in Study Notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
