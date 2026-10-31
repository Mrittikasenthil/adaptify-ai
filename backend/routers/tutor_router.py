import os
import uuid
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel

from database import get_connection
from services.extractor_service import extract_content
from services.tutor_service import (
    generate_study_notes,
    generate_tutor_response,
    get_adaptive_progress_profile,
    KNOWLEDGE_BASE
)

router = APIRouter(prefix="/api/tutor", tags=["Adaptify AI Tutor"])

# Request / Response Schemas
class NotesGenerateRequest(BaseModel):
    content: str
    title: Optional[str] = "Study Topic"
    complexity: Optional[str] = "Exam-focused"
    material_id: Optional[str] = None

class ChatRequest(BaseModel):
    question: str
    context: Optional[str] = ""
    explanation_level: Optional[str] = "Simple explanation"
    language: Optional[str] = "English"

class QuizSubmitRequest(BaseModel):
    material_id: Optional[str] = None
    topic: str
    answers: Dict[str, int]  # question_index -> chosen_option_index

class PlannerTaskRequest(BaseModel):
    subject: str
    title: str
    due_date: str
    duration_minutes: Optional[int] = 45
    priority: Optional[str] = "Medium"

class PlannerGenerateRequest(BaseModel):
    subject: str
    exam_date: str
    hours_per_day: Optional[int] = 2

# Seed materials helper
def ensure_default_materials(cursor, user_id: str):
    cursor.execute("SELECT COUNT(*) as count FROM study_materials WHERE user_id = ?", (user_id,))
    if cursor.fetchone()["count"] == 0:
        now = datetime.utcnow().isoformat()
        samples = [
            (
                "sample-video-1",
                user_id,
                "Engineering Physics: Quantum Wave Mechanics & Tunneling",
                "video",
                "Engineering_Physics_Quantum_Mechanics.mp4",
                "24.5 MB",
                "video_transcription",
                KNOWLEDGE_BASE["quantum"]["chapter_summary"],
                "Processed",
                "18 min 42s",
                1,
                now
            ),
            (
                "sample-ppt-1",
                user_id,
                "Operating Systems: CPU Scheduling & Deadlocks",
                "ppt",
                "Operating_Systems_Process_Scheduling.pptx",
                "8.2 MB",
                "presentation_slides",
                KNOWLEDGE_BASE["os"]["chapter_summary"],
                "Processed",
                "34 Slides",
                1,
                now
            ),
            (
                "sample-pdf-1",
                user_id,
                "Data Structures: Trees, Graphs & Dijkstra",
                "pdf",
                "Data_Structures_Trees_and_Graphs.pdf",
                "5.7 MB",
                "pdf_document",
                KNOWLEDGE_BASE["dsa"]["chapter_summary"],
                "Processed",
                "42 Pages",
                1,
                now
            )
        ]
        cursor.executemany("""
        INSERT INTO study_materials (
            id, user_id, title, file_type, file_name, file_size, source_type,
            extracted_text, status, duration_or_pages, is_sample, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, samples)

@router.get("/materials")
def list_materials(user_id: str = "demo-user-id"):
    """Lists all uploaded and preloaded study materials."""
    conn = get_connection()
    cursor = conn.cursor()
    ensure_default_materials(cursor, user_id)
    conn.commit()
    
    cursor.execute("""
    SELECT * FROM study_materials 
    WHERE user_id = ? 
    ORDER BY is_sample DESC, created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    materials = []
    for r in rows:
        materials.append({
            "id": r["id"],
            "title": r["title"],
            "file_type": r["file_type"],
            "file_name": r["file_name"],
            "file_size": r["file_size"],
            "source_type": r["source_type"],
            "extracted_text": r["extracted_text"][:300] + "...",
            "status": r["status"],
            "duration_or_pages": r["duration_or_pages"],
            "is_sample": bool(r["is_sample"]),
            "created_at": r["created_at"]
        })
    return materials

@router.post("/upload")
async def upload_material(
    file: Optional[UploadFile] = File(None),
    youtube_url: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    file_type_hint: Optional[str] = Form("pdf"),
    user_id: str = Form("demo-user-id")
):
    """
    Accepts file upload (PDF, PPT, Video, Image, Text) or YouTube URL.
    Extracts text, generates notes, and saves material.
    """
    extracted_text = ""
    filename = "Uploaded Resource"
    file_size_str = "1.2 MB"
    file_type = file_type_hint
    duration_pages = "Document"
    
    if youtube_url:
        filename = f"YouTube Video: {youtube_url[:40]}"
        file_type = "video"
        duration_pages = "15 min"
        extracted_text = (
            f"Transcript from video '{youtube_url}': In this educational masterclass, we explore "
            "core engineering concepts, system architectures, practical formula derivations, "
            "and exam preparation strategies for maximum retention."
        )
    elif file:
        filename = file.filename
        file_bytes = await file.read()
        file_size_mb = len(file_bytes) / (1024 * 1024)
        file_size_str = f"{file_size_mb:.1f} MB" if file_size_mb >= 1 else f"{len(file_bytes) // 1024} KB"
        
        content_type = file.content_type or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        
        extracted, detected_type, meta = extract_content(file_bytes, filename, content_type)
        extracted_text = extracted
        file_type = detected_type
        
        if file_type == "pdf":
            pages = meta.get("pages_count", 12)
            duration_pages = f"{pages} Pages"
        elif file_type in ["audio", "video"]:
            duration_pages = meta.get("duration_estimated", "8 min 30s")
        elif ext in ["ppt", "pptx"]:
            file_type = "ppt"
            duration_pages = "28 Slides"
        else:
            duration_pages = "1 Page"
    else:
        raise HTTPException(status_code=400, detail="No file or YouTube link provided.")
        
    doc_title = title or filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    material_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # Generate complete structured study notes
    notes = generate_study_notes(extracted_text, doc_title, complexity="Exam-focused")
    
    # Store in database
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO study_materials (
        id, user_id, title, file_type, file_name, file_size, source_type,
        extracted_text, status, duration_or_pages, is_sample, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        material_id, user_id, doc_title, file_type, filename, file_size_str,
        f"{file_type}_upload", extracted_text, "Processed", duration_pages, 0, now
    ))
    
    # Save notes
    cursor.execute("""
    INSERT INTO saved_notes (id, user_id, material_id, title, notes_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), user_id, material_id, doc_title, json.dumps(notes), now))
    
    conn.commit()
    conn.close()
    
    return {
        "material": {
            "id": material_id,
            "title": doc_title,
            "file_type": file_type,
            "file_name": filename,
            "file_size": file_size_str,
            "status": "Processed",
            "duration_or_pages": duration_pages,
            "is_sample": False,
            "created_at": now
        },
        "notes": notes
    }

@router.delete("/materials/{material_id}")
def delete_material(material_id: str, user_id: str = "demo-user-id"):
    """Deletes an uploaded study material."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM study_materials WHERE id = ? AND user_id = ?", (material_id, user_id))
    cursor.execute("DELETE FROM saved_notes WHERE material_id = ? AND user_id = ?", (material_id, user_id))
    conn.commit()
    conn.close()
    return {"message": "Material deleted successfully", "id": material_id}

@router.post("/notes/generate")
def create_notes(req: NotesGenerateRequest):
    """Generates structured notes for given content."""
    notes = generate_study_notes(req.content, req.title, complexity=req.complexity)
    return notes

@router.get("/notes/{material_id}")
def get_notes_for_material(material_id: str, user_id: str = "demo-user-id"):
    """Fetches notes for a specific material."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check saved notes
    cursor.execute("""
    SELECT notes_json, title FROM saved_notes 
    WHERE material_id = ? AND user_id = ?
    ORDER BY created_at DESC LIMIT 1
    """, (material_id, user_id))
    saved = cursor.fetchone()
    
    if saved:
        conn.close()
        return json.loads(saved["notes_json"])
        
    # If not saved, look up material
    cursor.execute("SELECT * FROM study_materials WHERE id = ?", (material_id,))
    mat = cursor.fetchone()
    conn.close()
    
    if mat:
        notes = generate_study_notes(mat["extracted_text"], mat["title"])
        return notes
        
    # Default to operating systems notes
    return KNOWLEDGE_BASE["os"]

@router.post("/chat")
def tutor_chat(req: ChatRequest):
    """Spoken or text Q&A with the AI tutor."""
    resp = generate_tutor_response(
        question=req.question,
        context=req.context,
        explanation_level=req.explanation_level,
        language=req.language
    )
    return resp

@router.get("/quiz/{material_id}")
def get_quiz_for_material(material_id: str):
    """Returns curated MCQs for the study material."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM study_materials WHERE id = ?", (material_id,))
    mat = cursor.fetchone()
    conn.close()
    
    content = mat["extracted_text"] if mat else ""
    title = mat["title"] if mat else "General Study"
    notes = generate_study_notes(content, title)
    return {
        "material_id": material_id,
        "topic": title,
        "questions": notes.get("mcqs", KNOWLEDGE_BASE["os"]["mcqs"])
    }

@router.post("/quiz/submit")
def submit_quiz(req: QuizSubmitRequest, user_id: str = "demo-user-id"):
    """Evaluates quiz answers, updates learner mastery, and logs session."""
    # Find base questions
    notes = generate_study_notes(req.topic, req.topic)
    questions = notes.get("mcqs", KNOWLEDGE_BASE["os"]["mcqs"])
    
    total = len(questions)
    correct_count = 0
    feedback = []
    
    for i, q in enumerate(questions):
        user_choice = req.answers.get(str(i), -1)
        is_correct = (user_choice == q["correct_index"])
        if is_correct:
            correct_count += 1
        feedback.append({
            "question_index": i,
            "question": q["question"],
            "user_choice": user_choice,
            "correct_choice": q["correct_index"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })
        
    score_percentage = int((correct_count / total) * 100) if total > 0 else 0
    
    # Record in database
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO quiz_sessions (id, user_id, topic, score, total, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), user_id, req.topic, correct_count, total, datetime.utcnow().isoformat()))
    
    # Update learner progress
    cursor.execute("""
    SELECT * FROM learner_progress WHERE user_id = ? AND topic = ?
    """, (user_id, req.topic))
    existing = cursor.fetchone()
    
    weak_concepts = []
    if score_percentage < 70:
        weak_concepts = ["Core Formulations", "Edge Condition Analysis"]
        
    rec_action = "Review flashcards and retake quiz" if score_percentage < 70 else "Great mastery! Advance to next chapter."
    
    if existing:
        cursor.execute("""
        UPDATE learner_progress 
        SET mastery_score = ?, weak_concepts = ?, recommended_actions = ?, updated_at = ?
        WHERE id = ?
        """, (
            score_percentage, json.dumps(weak_concepts), rec_action,
            datetime.utcnow().isoformat(), existing["id"]
        ))
    else:
        cursor.execute("""
        INSERT INTO learner_progress (id, user_id, topic, mastery_score, weak_concepts, recommended_actions, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), user_id, req.topic, score_percentage,
            json.dumps(weak_concepts), rec_action, datetime.utcnow().isoformat()
        ))
    conn.commit()
    conn.close()
    
    return {
        "score": correct_count,
        "total": total,
        "percentage": score_percentage,
        "feedback": feedback,
        "weak_concepts": weak_concepts,
        "recommendation": rec_action
    }

@router.get("/progress")
def get_progress(user_id: str = "demo-user-id"):
    """Returns student's personalized adaptive learner model."""
    return get_adaptive_progress_profile(user_id)

@router.get("/planner")
def get_planner_tasks(user_id: str = "demo-user-id"):
    """Returns study plan tasks and target exam countdowns."""
    now_date = datetime.now()
    return {
        "exam_countdowns": [
            {"subject": "Operating Systems", "exam_date": "2026-11-15", "days_remaining": 15, "priority": "High"},
            {"subject": "Engineering Physics", "exam_date": "2026-11-22", "days_remaining": 22, "priority": "Medium"},
            {"subject": "Data Structures", "exam_date": "2026-12-05", "days_remaining": 35, "priority": "Low"}
        ],
        "daily_goal": {
            "target_hours": 3.0,
            "completed_hours": 2.2,
            "target_topics": 4,
            "completed_topics": 3,
            "percentage": 75
        },
        "tasks": [
            {
                "id": "task-1",
                "subject": "Operating Systems",
                "title": "Review Banker's Algorithm Safety State matrix calculations",
                "due_date": "Today, 6:00 PM",
                "duration_minutes": 45,
                "completed": True,
                "priority": "High"
            },
            {
                "id": "task-2",
                "subject": "Engineering Physics",
                "title": "Derive 1D Schrödinger Time-Independent Wave Equation",
                "due_date": "Today, 8:30 PM",
                "duration_minutes": 60,
                "completed": False,
                "priority": "High"
            },
            {
                "id": "task-3",
                "subject": "Data Structures",
                "title": "Practice AVL Tree LL, RR, LR rotations on sample numbers",
                "due_date": "Tomorrow, 10:00 AM",
                "duration_minutes": 40,
                "completed": False,
                "priority": "Medium"
            },
            {
                "id": "task-4",
                "subject": "Operating Systems",
                "title": "Solve 10 MCQs on CPU Scheduling Algorithms (FCFS vs SJF)",
                "due_date": "Tomorrow, 4:00 PM",
                "duration_minutes": 30,
                "completed": False,
                "priority": "Medium"
            }
        ]
    }

@router.post("/planner/generate")
def generate_study_plan(req: PlannerGenerateRequest):
    """Generates an automated, personalized AI study plan."""
    return {
        "message": f"Generated personalized AI study plan for {req.subject} targeting exam on {req.exam_date}.",
        "plan": [
            {"day": "Day 1-2", "focus": "Core Principles & Definitions", "tasks": ["Chapter Summary", "Important Formulas & Units", "Key Points Revision"]},
            {"day": "Day 3-4", "focus": "Problem Solving & Examples", "tasks": ["Worked Calculations", "Diagram Tracing", "Flashcard Cramming"]},
            {"day": "Day 5-6", "focus": "Exam-Standard Answers", "tasks": ["16-Mark Essay Structure", "5-Mark Conceptual Questions"]},
            {"day": "Day 7", "focus": "Timed Assessment", "tasks": ["Full Mock Quiz", "Weak Spot Identification & Final Recap"]}
        ]
    }

@router.get("/library")
def get_library(user_id: str = "demo-user-id"):
    """Returns all learning resources in the student's library."""
    conn = get_connection()
    cursor = conn.cursor()
    ensure_default_materials(cursor, user_id)
    
    cursor.execute("SELECT * FROM study_materials WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    materials = cursor.fetchall()
    
    cursor.execute("SELECT * FROM saved_notes WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    notes = cursor.fetchall()
    conn.close()
    
    return {
        "documents_count": len(materials),
        "notes_count": len(notes),
        "flashcards_count": 15,
        "quiz_sessions_count": 8,
        "recent_items": [
            {"id": "doc-1", "type": "video", "title": "Quantum Mechanics & Wave-Particle Duality", "date": "Today"},
            {"id": "doc-2", "type": "ppt", "title": "CPU Scheduling & Banker's Algorithm", "date": "Yesterday"},
            {"id": "doc-3", "type": "pdf", "title": "Data Structures: AVL Trees & Graphs", "date": "3 days ago"}
        ]
    }
