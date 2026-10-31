import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  X
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api";

export default function QuizModal({
  isOpen,
  onClose,
  materialId,
  topicTitle = "Active Topic",
  questions = [],
  onQuizCompleted
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [timerActive, setTimerActive] = useState(true);

  // Fallback sample questions if none provided
  const activeQuestions = questions.length > 0 ? questions : [
    {
      question: "Which CPU scheduling algorithm provably gives the minimum average waiting time?",
      options: ["First-Come First-Served", "Shortest Job First (SJF)", "Round Robin", "Priority Scheduling"],
      correct_index: 1,
      explanation: "Shortest Job First (SJF) is provably optimal because servicing shorter bursts first minimizes cumulative waiting times across the process set."
    },
    {
      question: "In Banker's Algorithm, what does the condition Need[i] <= Available signify?",
      options: ["Process has terminated", "Process can safely obtain all remaining resources to complete", "System is already deadlocked", "Memory is fragmented"],
      correct_index: 1,
      explanation: "It confirms that the system holds sufficient unallocated resources to satisfy the process's maximum declared requirement."
    },
    {
      question: "If a quantum particle is accelerated through potential V, its de Broglie wavelength is proportional to:",
      options: ["V", "V²", "1 / √V", "√V"],
      correct_index: 2,
      explanation: "Since λ = h / √(2meV), the wavelength is inversely proportional to the square root of the accelerating potential (1/√V)."
    },
    {
      question: "What is the permissible range of Balance Factor (BF) for any node in a valid AVL Tree?",
      options: ["Only 0", "{-1, 0, +1}", "{-2, 0, +2}", "Any integer value"],
      correct_index: 1,
      explanation: "An AVL Tree strictly maintains height balance such that BF = Height(Left) - Height(Right) ∈ {-1, 0, +1} for all nodes."
    }
  ];

  // Timer countdown
  useEffect(() => {
    let timer;
    if (isOpen && timerActive && !submitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timerActive, submitted, timeLeft]);

  const handleSelectOption = (qIdx, optIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    setTimerActive(false);

    let correctCount = 0;
    activeQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct_index) {
        correctCount += 1;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const quizResult = {
      score: correctCount,
      total,
      percentage,
      topic: topicTitle
    };

    setResults(quizResult);

    // Confetti celebration if scored >= 75%
    if (percentage >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    // Submit to backend
    try {
      await api.submitQuiz(materialId, topicTitle, selectedAnswers);
      if (onQuizCompleted) onQuizCompleted(quizResult);
    } catch (err) {
      console.warn("Quiz submission error:", err);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setResults(null);
    setTimeLeft(300);
    setTimerActive(true);
  };

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentIdx];
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Adaptive Exam Practice Quiz
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                Topic: {topicTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {!submitted ? (
            <div>
              {/* Question Navigation Tracker */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Question {currentIdx + 1} of {activeQuestions.length}
                </span>

                <div className="flex items-center gap-1.5">
                  {activeQuestions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                        currentIdx === i
                          ? "bg-purple-600 text-white shadow-xs"
                          : selectedAnswers[i] !== undefined
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 mb-5">
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentIdx, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium flex items-center gap-3 transition-all ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/60 text-purple-900 shadow-xs"
                          : "border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/20 text-slate-700"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIdx < activeQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" /> Submit Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6">
              {/* Score Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50 to-white border border-purple-100 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-purple-500/25">
                  {results.percentage}%
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {results.percentage >= 80 ? "Outstanding Performance! 🌟" : results.percentage >= 60 ? "Good Effort! Keep Improving 📈" : "Needs Practice — Review Flashcards 📚"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You scored {results.score} out of {results.total} questions correctly on <strong>{topicTitle}</strong>.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Adaptive Learner Model Updated!
                </div>
              </div>

              {/* Question-by-question Review */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Detailed Answer Key & Explanations:
                </h4>
                {activeQuestions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correct_index;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        isCorrect
                          ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                          : "bg-rose-50/50 border-rose-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800">
                            Q{idx + 1}. {q.question}
                          </p>
                          <p className="text-slate-600">
                            Your answer:{" "}
                            <span className={isCorrect ? "font-bold text-emerald-700" : "font-bold text-rose-600"}>
                              {userAns !== undefined ? q.options[userAns] : "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-emerald-700 font-semibold">
                              Correct answer: {q.options[q.correct_index]}
                            </p>
                          )}
                          <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 mt-2 text-slate-600">
                            <span className="font-semibold text-purple-700">💡 Why: </span>
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
                >
                  Done & Back to Notes
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
