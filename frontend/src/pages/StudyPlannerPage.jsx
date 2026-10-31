import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  ArrowRight,
  BookOpen,
  CalendarDays
} from "lucide-react";
import { api } from "../services/api";

export default function StudyPlannerPage() {
  const [plannerData, setPlannerData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Operating Systems");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  useEffect(() => {
    async function loadPlanner() {
      const data = await api.getPlanner();
      if (data) {
        setPlannerData(data);
        setTasks(data.tasks || []);
      }
    }
    loadPlanner();
  }, []);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      subject: newSubject,
      title: newTaskTitle.trim(),
      due_date: "Today, 9:00 PM",
      duration_minutes: 45,
      completed: false,
      priority: "Medium"
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await api.generateStudyPlan("Operating Systems & Physics", "2026-11-15", 3);
      setGeneratedPlan(res.plan);
    } catch {
      setGeneratedPlan([
        { day: "Day 1-2", focus: "Core Principles & Definitions", tasks: ["Chapter Summary", "Formulas & Units", "Key Points"] },
        { day: "Day 3-4", focus: "Problem Solving & Examples", tasks: ["Calculations", "Diagrams", "Flashcards"] },
        { day: "Day 5-6", focus: "Exam Answers", tasks: ["16-Mark Essay Structure", "5-Mark Conceptual Qs"] },
        { day: "Day 7", focus: "Timed Assessment", tasks: ["Full Mock Quiz", "Weak Spot Review"] }
      ]);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Intelligent Study Scheduling
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Smart Study Planner & Exam Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimize your preparation roadmap based on remaining days, topic difficulty and cognitive mastery.
          </p>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={isGeneratingPlan}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isGeneratingPlan ? "Generating Plan..." : "Generate AI Study Plan"}
        </button>
      </div>

      {/* Target Exam Countdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(plannerData?.exam_countdowns || [
          { subject: "Operating Systems", exam_date: "2026-11-15", days_remaining: 15, priority: "High" },
          { subject: "Engineering Physics", exam_date: "2026-11-22", days_remaining: 22, priority: "Medium" },
          { subject: "Data Structures", exam_date: "2026-12-05", days_remaining: 35, priority: "Low" }
        ]).map((exam, i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                {exam.priority} Priority
              </span>
              <span className="text-xs text-slate-400 font-semibold">{exam.exam_date}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">{exam.subject}</h3>
            <p className="text-2xl font-black text-purple-700">
              {exam.days_remaining} <span className="text-xs font-semibold text-slate-500">days left</span>
            </p>
          </div>
        ))}
      </div>

      {/* Daily Goal & Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Task List (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Today's Scheduled Study Tasks
            </h3>
            <span className="text-xs text-slate-400">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          {/* Quick Add Task */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="text-xs bg-purple-50/60 border border-purple-200 rounded-xl px-2.5 py-2 font-semibold text-purple-800 focus:outline-none"
            >
              <option value="Operating Systems">Operating Systems</option>
              <option value="Engineering Physics">Engineering Physics</option>
              <option value="Data Structures">Data Structures</option>
            </select>

            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add study task (e.g. Derive 1D Schrödinger equation)..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </form>

          {/* Tasks List */}
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  task.completed
                    ? "bg-emerald-50/50 border-emerald-200 opacity-75"
                    : "bg-[#FAF9FF] hover:bg-purple-50/40 border-purple-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600 shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xs sm:text-sm font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-purple-600 font-semibold">
                      {task.subject} • {task.duration_minutes} mins
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-400">
                  {task.due_date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Generated Study Roadmap (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Exam Prep Strategy
            </h3>
          </div>

          <div className="space-y-3">
            {(generatedPlan || [
              { day: "Day 1-2", focus: "Core Principles & Definitions", tasks: ["Chapter Summary", "Formulas & Units", "Key Points"] },
              { day: "Day 3-4", focus: "Problem Solving & Examples", tasks: ["Calculations", "Diagrams", "Flashcards"] },
              { day: "Day 5-6", focus: "Exam Answers", tasks: ["16-Mark Essay Structure", "5-Mark Conceptual Qs"] },
              { day: "Day 7", focus: "Timed Assessment", tasks: ["Full Mock Quiz", "Weak Spot Review"] }
            ]).map((phase, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-purple-700">{phase.day}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-purple-200 text-slate-600">
                    {phase.focus}
                  </span>
                </div>
                <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                  {phase.tasks.map((task, ti) => (
                    <li key={ti}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
