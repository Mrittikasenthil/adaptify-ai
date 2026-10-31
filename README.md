# ADAPTIFY AI — Adaptive Exam-Prep Tutor & Personal Learning Platform

> **"An AI tutor that doesn't teach every student the same way. It learns how each student learns, and adapts accordingly."**
> 
> **Tagline:** *Learn Faster. Understand Better. Achieve More.*

---

## 🌟 The Innovation: Personalized Adaptive Learning Engine

Most educational platforms deliver identical, one-size-fits-all content: if a student struggles with a complex derivation like the *Schrödinger Wave Equation* or *Banker's Algorithm*, standard textbooks simply repeat the same dense paragraphs.

**ADAPTIFY AI** solves this problem by continuously constructing a **Personalized Learner Model** for every student:
- **Real-Time Comprehension Tracking**: Evaluates student understanding across topics (Strong, Improving, Needs Practice).
- **Weak Concept Identification**: Pins specific sub-topics causing mistakes in quizzes (e.g. *Safety State Verification*, *Quantum Barrier Potentials*).
- **Dynamic Cognitive Complexity Adjustment**: Switches between 5 explanation levels:
  1. *Beginner (Simple Everyday Analogies)*
  2. *Simple Explanation (Direct & Accessible)*
  3. *Detailed Technical (Mechanisms & Rigor)*
  4. *Exam-Oriented (Full 16-Mark University Blueprint)*
  5. *Real-World Application (Industry Context)*
- **Multilingual & Tanglish AI Tutor**: Supports explanations in **English**, **Tamil (தமிழ்)**, and **Tanglish** (conversational Tamil + English blend widely used by Indian engineering students).

---

## 🎙️ Wispr Flow Voice Interaction Architecture

ADAPTIFY AI is built from the ground up for hands-free, high-velocity voice-based learning:

### 1. Wispr Flow Focused Dictation Workflow
Wispr Flow runs as an external, high-performance system dictation client on your Mac/Windows device. 
- All major input fields and text areas across ADAPTIFY AI are designed to be **Wispr Flow Compatible**.
- Simply click into any text field (AI Tutor, Ask Anything, Notes generator, or Study Planner), trigger your Wispr Flow shortcut, and speak naturally. Spoken dictation flows directly into the focused field with zero latency.

### 2. Dedicated "Talk to ADAPTIFY AI" Voice Studio
- Microphone-themed interface with dynamic soundwave visualizers and 5 clear operational states:
  `1. Ready to Listen` → `2. Listening` → `3. Transcribing` → `4. Processing` → `5. AI Responding`
- Live transcription preview with editable text before submission.
- **Truthful Integration Guarantee**: Never falsely claims direct cloud API connection when running locally. Clearly displays the active engine mode (`Wispr Flow Cloud API` if an API key is configured, or `Web Speech API Browser Fallback`).

### 3. AI Spoken Response (Text-to-Speech)
- High-fidelity speech synthesis using the Web Speech API (`speechSynthesis`).
- Full playback controls on every AI tutor response: **Listen**, **Pause**, **Resume**, **Stop**, and **Replay**.
- Adjustable speech rate slider (0.8x, 1.0x, 1.25x) and system voice selection.

---

## 📐 Main Dashboard Architecture (3-Column Composition)

Redesigned strictly following the reference layout with soft lavender accents, rounded 3D cards, and an interactive 3D AI tutor robot:

### 1. Left Section – Branding and Features
- **Branding**: `ADAPTIFY AI — Learn Faster. Understand Better. Achieve More.`
- **4 Feature Cards with Soft Pastel Badges**:
  1. *Saves Time* – Convert lengthy learning materials into notes.
  2. *Improves Understanding* – Clear explanations and key concepts.
  3. *Smart Summaries* – Summarize videos, PDFs and presentations.
  4. *Personalized Learning* – Tailored explanations based on your mastery level.
- **Uploaded Content Previews**:
  - 📹 *Video Learning Card* (`Engineering_Physics_Quantum_Mechanics.mp4`, 18 min 42s, Status: Processed)
  - 📊 *PPT Presentation Card* (`Operating_Systems_Process_Scheduling.pptx`, 34 slides, Status: Processed)
  - 📄 *PDF Document Card* (`Data_Structures_Trees_and_Graphs.pdf`, 42 pages, Status: Processed)
  - *Clicking any card switches the entire dashboard context immediately!*

### 2. Center Section – AI Tutor & 12-Part Notes
- **Prominent 3D AI Tutor Robot**: Expressive eyes with natural blinking, glowing antenna, soundwave visualizer chest core, and reactive emotion states.
- **Welcome Greeting**:
  `"Hi! I'm your AI Tutor. I turn complex learning materials into simple explanations, notes and interactive lessons."`
- **Animated Workflow Pipeline**:
  `Analyze Content → Extract Key Points → Generate Smart Notes → Personalized Learning`
- **12-Part AI Study Notes Panel**:
  - 📌 *Key Points & Core Invariants*
  - 💡 *Simple Everyday Analogy*
  - 📖 *Important Definitions & Glossary*
  - 🧮 *Formulas & Mathematical Models*
  - 🔬 *Worked Calculation Examples*
  - 📊 *Interactive Diagrams (ASCII / SVG Architecture Flow)*
  - 🎯 *2-Mark & 5-Mark University Exam Questions*
  - 🏆 *16-Mark Comprehensive Essay Answers*
  - 🃏 *Interactive Flip Flashcards*
  - ⚡ *High-Yield Quick Revision Cram Sheet*
- **Actions**: Copy Notes (with toast feedback), Download (.md/.txt), Save to Library, and Launch Assessment Quiz.

### 3. Right Section – Upload Anything & Ask Anything
- **Upload Anything Panel**:
  - Supports **PDF documents**, **PowerPoint PPT/PPTX**, **Videos (MP4, MOV, WEBM)**, **Diagrams/Images**, and **YouTube links**.
  - Drag-and-drop file upload with live multi-stage progress bar:
    `Uploading (100%) → Extracting Text → Generating Notes → Completed`
- **Ask Anything AI Chat Interface**:
  - Real-time conversational tutor stream with suggested question chips:
    - *"Explain this topic in simple words"*
    - *"What are the important exam questions?"*
    - *"Generate 10 MCQs from this chapter"*
    - *"Explain this diagram"*
    - *"Give me 16-mark exam answers"*
    - *"Summarize this topic in Tanglish"*
  - Wispr Flow compatible focused input + inline voice mic button.

---

## 🗂️ Complete Navigation Structure (10 Functional Pages)

1. **Dashboard** (`overview`): Multi-column AI Tutor Hub with upload cards, notes panel, and chat.
2. **AI Tutor** (`tutor`): Deep conversational study room with 5 explanation levels and language switcher.
3. **Upload Materials** (`upload`): Document ingestion, pypdf text extraction, and video transcript inspector.
4. **Study Notes** (`notes`): Full 12-section notes viewer with flashcards and difficulty switcher.
5. **Adaptive Learning** (`adaptive`): Student mastery radar, weak concept tracking, and personalized recommendations.
6. **Practice & Quizzes** (`quiz`): Interactive MCQ assessment engine with instant scoring and explanations.
7. **Study Planner** (`planner`): Target exam countdowns, daily study goals, and AI-generated study roadmaps.
8. **Learning Library** (`library`): Searchable, filterable vault for all documents, notes, and quizzes.
9. **Analytics** (`analytics`): Weekly study hours bar chart, subject comprehension breakdown, and diagnostic insights.
10. **Profile & Settings** (`settings`): Student standing, language preference, voice speed, and optional API keys.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, Vite.
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic, HTTPX.
- **Database**: SQLite 3 with persistent relational storage for study materials, notes, quizzes, and learner profiles.
- **Document Processing**: `pypdf` for documents, multimodal transcription service for videos, and Web Speech API for voice.
- **AI Models**: Google Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`) with high-fidelity contextual academic fallback engine for offline reliability.

---

## 🏃 Quick Start Guide

### Option 1: 1-Click Launcher (Windows)
Double-click `start.bat` or run in PowerShell:
```powershell
.\start.ps1
```
Open **`http://localhost:8000`** in your browser!

### Option 2: Manual Start

**Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend Build:**
```bash
cd frontend
npm run build
```
*(The backend automatically serves the built frontend SPA from `frontend/dist` on port 8000!)*

---

## 🔑 Environment Configuration (Optional)

Create or edit `backend/.env`:
```env
# Google Gemini API Key (Optional — built-in contextual engine runs without key)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Wispr Flow API Key (Optional — browser speech fallback & system dictation run without key)
WISPR_FLOW_API_KEY=your_wispr_flow_key_here
```

---

## 🏆 Hackathon Demonstration Highlights

1. **Clean Light-Themed Visual Design**: Soft lavender background (`#F8F7FF`), vibrant purple/indigo gradient accents, rounded cards, subtle shadows, and modern typography.
2. **Interactive 3D Robot Mascot**: Friendly blinking avatar that responds visually when thinking, listening, or speaking.
3. **Genuine Wispr Flow Workflow**: Honest, functional integration supporting external dictation directly into focused inputs, complemented by browser speech fallback and text-to-speech speaker controls.
4. **Adaptive Learning In Action**: Missing an answer in the Practice Quiz immediately updates the topic score, pins the weak concept, and generates targeted revision notes.
5. **Exam-Ready Content**: Real university syllabus material covering *Engineering Physics*, *Operating Systems*, and *Data Structures*, complete with authentic 2-mark definitions, formulas, and 16-mark essays.
