import React from "react";
import {
  LayoutDashboard,
  Bot,
  UploadCloud,
  BookOpen,
  BrainCircuit,
  Award,
  Calendar,
  Library,
  BarChart3,
  Settings,
  Flame,
  Mic,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({
  activeTab,
  onSelectTab,
  onOpenVoiceModal,
  isCollapsed,
  onToggleCollapse
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "tutor", label: "AI Tutor", icon: Bot, badge: "Voice" },
    { id: "upload", label: "Upload Materials", icon: UploadCloud },
    { id: "notes", label: "Study Notes", icon: BookOpen, badge: "12 Parts" },
    { id: "adaptive", label: "Adaptive Learning", icon: BrainCircuit, highlight: true },
    { id: "quiz", label: "Practice & Quizzes", icon: Award },
    { id: "planner", label: "Study Planner", icon: Calendar },
    { id: "library", label: "Learning Library", icon: Library },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Profile & Settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-white/95 backdrop-blur-md border-r border-purple-100 flex flex-col h-screen sticky top-0 select-none z-30 transition-all duration-300 shadow-sm ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b border-purple-100 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div
          onClick={() => onSelectTab("overview")}
          className="flex items-center gap-3 cursor-pointer group"
          title="ADAPTIFY AI — Adaptive Exam-Prep Tutor"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-[2px] shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-800">
                  ADAPTIFY<span className="text-purple-600">.AI</span>
                </span>
              </div>
              <span className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider">
                Exam-Prep Tutor
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voice Tutor Quick Trigger Card */}
      {!isCollapsed ? (
        <div className="p-3 mx-3 my-2 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-100/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              Wispr Flow Voice
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <button
            onClick={onOpenVoiceModal}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" /> Talk to AI Tutor
          </button>
        </div>
      ) : (
        <div className="flex justify-center my-3">
          <button
            onClick={onOpenVoiceModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 hover:scale-105 transition-all"
            title="Talk to AI Tutor (Wispr Flow)"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 10 Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-xs transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/60"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile & Streak Widget */}
      <div className="p-3 border-t border-purple-100 space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800">7 Day Streak</p>
                <p className="text-[10px] text-slate-500">2.2 / 3.0 hrs today</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Top 5%
            </span>
          </div>
        )}

        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-1`}>
          <div
            onClick={() => onSelectTab("settings")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : "M"}
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  {user?.full_name || "Mrittika"}
                </p>
                <p className="text-[10px] text-slate-400">{user?.academic_level || "Year 2 Engineering"}</p>
              </div>
            )}
          </div>

          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="mt-2 p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
