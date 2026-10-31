import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Sparkles,
  Calendar,
  FileText,
  X,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { api } from "../services/api";

export default function ProjectsPage({ onOpenCreateWithContent }) {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (proj) => {
    setSelectedProject(proj);
    try {
      setLoadingDetails(true);
      const details = await api.getProjectDetails(proj.id);
      setProjectDetails(details);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete project '${title}'?`)) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setProjectDetails(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand_name && p.brand_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Campaign Archives</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">My Projects</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access, view, export, and manage your past multi-platform repurposing campaigns.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
            placeholder="Search campaigns or brands..."
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-400 text-xs font-semibold">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400 mr-2" /> Loading projects...
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[10px] font-bold">
                    {p.brand_name || "Apex Cloud"}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {p.original_content}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">
                  {p.outputs_count || 7} Formats Generated
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenDetails(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <span>View Outputs</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-navy-900/40 border border-dashed border-slate-800">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">No campaigns found</h4>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? "Try a different search query." : "Generate your first repurposing campaign in the studio."}
          </p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-2xl bg-navy-900 border border-slate-700 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>
                <p className="text-xs text-slate-400">
                  Brand Memory: <span className="text-brand-300 font-semibold">{selectedProject.brand_name || "Apex Cloud"}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6 flex-1 overflow-y-auto">
              {/* Original Content Note */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Ingested Text
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedProject.original_content}"
                </p>
              </div>

              {/* Outputs List */}
              {loadingDetails ? (
                <div className="text-center py-10 text-xs text-slate-400">Loading campaign outputs...</div>
              ) : projectDetails?.outputs?.length > 0 ? (
                <div className="space-y-4">
                  {projectDetails.outputs.map((out) => (
                    <div key={out.id} className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                        <span className="font-bold text-brand-300 capitalize">{out.platform.replace("_", " ")}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            {out.consistency_score}% Brand Score
                          </span>
                          <button
                            onClick={() => handleCopyText(out.output_text, out.id)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Copy output"
                          >
                            {copiedId === out.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {out.output_text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">No output records found for this project.</div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
