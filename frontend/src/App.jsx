import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import VoiceTutorModal from "./components/VoiceTutorModal";
import QuizModal from "./components/QuizModal";

// 10 Core Application Pages
import LandingPage from "./pages/LandingPage";
import DashboardOverview from "./pages/DashboardOverview";
import AITutorPage from "./pages/AITutorPage";
import UploadMaterialsPage from "./pages/UploadMaterialsPage";
import StudyNotesPage from "./pages/StudyNotesPage";
import AdaptiveLearningPage from "./pages/AdaptiveLearningPage";
import PracticeQuizPage from "./pages/PracticeQuizPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import LearningLibraryPage from "./pages/LearningLibraryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

import { api } from "./services/api";

function MainApp() {
  const [view, setView] = useState("studio"); // "landing" | "studio"
  const [activeTab, setActiveTab] = useState("overview"); // 10 tabs
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  
  // Modals
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuizInfo, setActiveQuizInfo] = useState({ id: "", title: "" });
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load materials on mount
  useEffect(() => {
    async function initMaterials() {
      const list = await api.getMaterials();
      if (list && list.length > 0) {
        setMaterials(list);
        if (!selectedMaterialId) {
          setSelectedMaterialId(list[0].id);
        }
      }
    }
    initMaterials();
  }, []);

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  const handleUploadSuccess = (newMaterial) => {
    setMaterials((prev) => [newMaterial, ...prev]);
    setSelectedMaterialId(newMaterial.id);
  };

  const handleDeleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    if (selectedMaterialId === id && materials.length > 1) {
      setSelectedMaterialId(materials[0].id);
    }
  };

  const handleOpenQuiz = (materialId, title) => {
    setActiveQuizInfo({
      id: materialId || selectedMaterial?.id || "sample-os-1",
      title: title || selectedMaterial?.title || "Active Topic"
    });
    setQuizModalOpen(true);
  };

  // If user is viewing the landing page
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#F8F7FF] text-slate-800 font-sans">
        <LandingPage
          onGetStarted={() => setView("studio")}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          onOpenAuth={() => setView("studio")}
        />
        <VoiceTutorModal
          isOpen={voiceModalOpen}
          onClose={() => setVoiceModalOpen(false)}
          activeContext={selectedMaterial?.extracted_text}
          onAskQuestion={(q, lang) => api.askTutor(q, selectedMaterial?.title, "Simple explanation", lang)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F7FF] text-slate-800 font-sans overflow-hidden">
      
      {/* 1. Consistent Responsive Sidebar (10 Tabs) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          materials={materials}
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={(id) => setSelectedMaterialId(id)}
        />

        {/* View Switcher Banner for Testing Landing Page */}
        <div className="bg-purple-100/60 px-6 py-1.5 border-b border-purple-200/50 flex items-center justify-between text-xs text-purple-800 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ADAPTIFY AI Studio Active • 10 Modules Functional</span>
          </div>

          <button
            onClick={() => setView("landing")}
            className="hover:underline font-bold text-purple-700 hover:text-purple-900"
          >
            Preview Marketing Landing Page →
          </button>
        </div>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-mesh-lavender">
          {activeTab === "overview" && (
            <DashboardOverview
              materials={materials}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={(id) => setSelectedMaterialId(id)}
              onOpenVoiceModal={() => setVoiceModalOpen(true)}
              onOpenQuizModal={handleOpenQuiz}
              onUploadSuccess={handleUploadSuccess}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "tutor" && (
            <AITutorPage
              selectedMaterial={selectedMaterial}
              onOpenVoiceModal={() => setVoiceModalOpen(true)}
            />
          )}

          {activeTab === "upload" && (
            <UploadMaterialsPage
              materials={materials}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={(id) => setSelectedMaterialId(id)}
              onUploadSuccess={handleUploadSuccess}
              onDeleteMaterial={handleDeleteMaterial}
              onNavigateNotes={() => setActiveTab("notes")}
            />
          )}

          {activeTab === "notes" && (
            <StudyNotesPage
              selectedMaterial={selectedMaterial}
              onOpenQuizModal={handleOpenQuiz}
            />
          )}

          {activeTab === "adaptive" && (
            <AdaptiveLearningPage
              onOpenQuizModal={handleOpenQuiz}
              onNavigateNotes={() => setActiveTab("notes")}
            />
          )}

          {activeTab === "quiz" && (
            <PracticeQuizPage
              materials={materials}
              selectedMaterial={selectedMaterial}
              onOpenQuizModal={handleOpenQuiz}
            />
          )}

          {activeTab === "planner" && (
            <StudyPlannerPage />
          )}

          {activeTab === "library" && (
            <LearningLibraryPage
              materials={materials}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={(id) => setSelectedMaterialId(id)}
              onNavigateNotes={() => setActiveTab("notes")}
              onOpenQuizModal={handleOpenQuiz}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsPage />
          )}

          {activeTab === "settings" && (
            <SettingsPage />
          )}
        </main>

      </div>

      {/* 3. Global Wispr Flow Voice Interaction Modal */}
      <VoiceTutorModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        activeContext={selectedMaterial?.extracted_text}
        onAskQuestion={(q, lang) => api.askTutor(q, selectedMaterial?.title, "Simple explanation", lang)}
      />

      {/* 4. Global Adaptive Quiz Assessment Modal */}
      <QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        materialId={activeQuizInfo.id}
        topicTitle={activeQuizInfo.title}
        onQuizCompleted={(res) => {
          console.log("Quiz finished:", res);
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
