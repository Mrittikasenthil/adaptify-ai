import urllib.request
import urllib.parse
import json
import subprocess
import time
import sys

def run_e2e():
    python_exe = sys.executable
    print(f"[TEST] Starting uvicorn backend on port 8000 using {python_exe}...")
    server = subprocess.Popen(
        [python_exe, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=r"c:\Users\User\Desktop\wisprflow\backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    time.sleep(3) # Wait for server startup
    if server.poll() is not None:
        out, err = server.communicate()
        print("Backend exited early!")
        print("STDOUT:", out.decode('utf-8', errors='ignore'))
        print("STDERR:", err.decode('utf-8', errors='ignore'))
        return False
        
    try:
        # 1. Health check
        print("1. Probing /api/health...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/health")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("   Response:", data)
            assert data["app"] == "ADAPTIFY AI"
            assert data["status"] == "healthy"

        # 2. Materials
        print("2. Probing /api/tutor/materials...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/tutor/materials")
        with urllib.request.urlopen(req) as resp:
            materials = json.loads(resp.read().decode())
            print(f"   Materials count: {len(materials)}")
            assert len(materials) >= 3
            print(f"   Sample Material 1: {materials[0]['title']} ({materials[0]['file_type']})")

        # 3. Notes
        print("3. Probing /api/tutor/notes for sample material...")
        mat_id = materials[0]["id"]
        req = urllib.request.Request(f"http://127.0.0.1:8000/api/tutor/notes/{mat_id}")
        with urllib.request.urlopen(req) as resp:
            notes = json.loads(resp.read().decode())
            print(f"   Notes title: {notes.get('title')}")
            assert "key_points" in notes
            assert "formulas" in notes
            assert len(notes["key_points"]) > 0

        # 4. Chat with AI Tutor (Testing English and Tanglish)
        print("4. Testing /api/tutor/chat (Tanglish prompt)...")
        chat_payload = json.dumps({
            "question": "Summarize this topic in Tanglish",
            "context": "Operating Systems CPU Scheduling",
            "language": "Tanglish"
        }).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/tutor/chat",
            data=chat_payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            chat_resp = json.loads(resp.read().decode())
            print(f"   Chat answer preview: {chat_resp['answer'][:120]}...")
            assert "Tanglish" in chat_resp["language"]

        # 5. Quiz fetch & submit
        print("5. Testing /api/tutor/quiz and submit...")
        req = urllib.request.Request(f"http://127.0.0.1:8000/api/tutor/quiz/{mat_id}")
        with urllib.request.urlopen(req) as resp:
            quiz = json.loads(resp.read().decode())
            print(f"   Quiz questions count: {len(quiz['questions'])}")
            assert len(quiz["questions"]) > 0

        submit_payload = json.dumps({
            "material_id": mat_id,
            "topic": quiz["topic"],
            "answers": {"0": 1, "1": 1, "2": 2}
        }).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/tutor/quiz/submit",
            data=submit_payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            eval_res = json.loads(resp.read().decode())
            print(f"   Quiz Score: {eval_res['score']}/{eval_res['total']} ({eval_res['percentage']}%)")
            assert "percentage" in eval_res

        # 6. Learner Progress
        print("6. Testing /api/tutor/progress...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/tutor/progress")
        with urllib.request.urlopen(req) as resp:
            prog = json.loads(resp.read().decode())
            print(f"   Student: {prog['student_name']}, Mastery: {prog['overall_comprehension']}%")
            assert prog["overall_comprehension"] > 0

        # 7. Wispr Flow Status
        print("7. Testing /api/wispr/status...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/wispr/status")
        with urllib.request.urlopen(req) as resp:
            wstatus = json.loads(resp.read().decode())
            print(f"   Wispr Engine: {wstatus['active_engine_name']}")
            assert wstatus["dictation_workflow_supported"] == True

        # 8. Frontend SPA Root
        print("8. Probing Root SPA / (Serving built React index.html)...")
        req = urllib.request.Request("http://127.0.0.1:8000/")
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode()
            print(f"   HTML Length: {len(html)} bytes")
            assert "ADAPTIFY AI" in html

        print("\n=======================================================")
        print("🎉 ALL ADAPTIFY AI E2E TESTS PASSED WITH 100% SUCCESS!")
        print("=======================================================")
        return True

    except Exception as e:
        print(f"E2E Test Failed: {e}")
        return False
    finally:
        server.terminate()
        server.wait()

if __name__ == "__main__":
    success = run_e2e()
    sys.exit(0 if success else 1)
