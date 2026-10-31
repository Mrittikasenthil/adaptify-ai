import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"c:\Users\User\Desktop\wisprflow\backend")

from database import init_db
from seed_data import seed_initial_data
import routers.tutor_router as tutor
import routers.wispr_router as wispr
from services.tutor_service import generate_study_notes, generate_tutor_response

print("1. Initializing DB and seed data...")
init_db()
seed_initial_data()
print("   Database initialized.")

print("2. Testing list_materials()...")
mats = tutor.list_materials()
print(f"   Materials count: {len(mats)}")
assert len(mats) >= 3
for m in mats:
    print(f"   - {m['title']} ({m['file_type']}) -> {m['status']}")

print("3. Testing get_notes_for_material()...")
notes = tutor.get_notes_for_material(mats[0]["id"])
print(f"   Notes Title: {notes.get('title')}")
assert "key_points" in notes
assert len(notes["key_points"]) > 0
print(f"   Key points count: {len(notes['key_points'])}")
print(f"   Formulas count: {len(notes.get('formulas', []))}")

print("4. Testing tutor_chat (Tanglish)...")
chat_res = tutor.tutor_chat(tutor.ChatRequest(
    question="Summarize this topic in Tanglish",
    context="Quantum Physics",
    language="Tanglish"
))
print("   Tanglish answer preview:", chat_res["answer"][:100], "...")
assert "Tanglish" in chat_res["language"]

print("5. Testing tutor_chat (16-mark essay)...")
chat_16 = tutor.tutor_chat(tutor.ChatRequest(
    question="Give me 16-mark exam answers for CPU Scheduling",
    context="Operating Systems",
    explanation_level="Exam-oriented explanation"
))
print("   16-Mark answer preview:", chat_16["answer"][:100], "...")
assert len(chat_16["answer"]) > 100

print("6. Testing quiz submit...")
quiz_res = tutor.submit_quiz(tutor.QuizSubmitRequest(
    material_id=mats[0]["id"],
    topic=mats[0]["title"],
    answers={"0": 1, "1": 1, "2": 2}
))
print(f"   Quiz Score: {quiz_res['score']}/{quiz_res['total']} ({quiz_res['percentage']}%)")
assert "score" in quiz_res

print("7. Testing get_progress()...")
prog = tutor.get_progress()
print(f"   Student: {prog['student_name']}, Comprehension: {prog['overall_comprehension']}%")
assert len(prog["topics"]) >= 4

print("8. Testing get_wispr_status()...")
wstatus = wispr.get_wispr_status()
print(f"   Active Engine: {wstatus['active_engine_name']}")
assert wstatus["dictation_workflow_supported"] == True

print("\n=======================================================")
print("🎉 ALL ADAPTIFY AI DIRECT FUNCTION TESTS PASSED 100%!")
print("=======================================================")
