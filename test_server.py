import urllib.request
import json
import subprocess
import time
import sys

def run_test():
    python_exe = sys.executable
    print(f"Starting uvicorn server with {python_exe}...")
    server = subprocess.Popen(
        [python_exe, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=r"c:\Users\User\Desktop\wisprflow\backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    time.sleep(3) # Wait for server to start
    if server.poll() is not None:
        out, err = server.communicate()
        print("Uvicorn exited early!")
        print("STDOUT:", out.decode('utf-8', errors='ignore'))
        print("STDERR:", err.decode('utf-8', errors='ignore'))
        return
    
    try:
        # 1. Health check
        print("1. Probing /api/health...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/health")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("   Response:", data)
            assert data["status"] == "healthy"
            
        # 2. Get active brand profile
        print("2. Probing /api/brand-memory/active...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/brand-memory/active")
        with urllib.request.urlopen(req) as resp:
            brand = json.loads(resp.read().decode())
            print("   Active Brand:", brand["brand_name"])
            print("   Tone:", brand["tone_of_voice"])
            assert brand["brand_name"] is not None
            
        # 3. Stats overview
        print("3. Probing /api/stats/overview...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/stats/overview")
        with urllib.request.urlopen(req) as resp:
            stats = json.loads(resp.read().decode())
            print("   Stats:", stats)
            assert stats["total_generated"] >= 0
            
        # 4. Repurpose content
        print("4. Testing /api/content/repurpose across 7 platforms...")
        payload = json.dumps({
            "original_content": "Modern teams need unified telemetry and automated root cause analysis. This compounds velocity by 40% and builds an architectural moat.",
            "title": "Automated Telemetry Test",
            "content_type": "text",
            "platforms": ["linkedin", "twitter", "instagram", "youtube_shorts", "blog", "newsletter", "ad"],
            "language": "English"
        }).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/content/repurpose",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            rep = json.loads(resp.read().decode())
            print(f"   Generated {len(rep['outputs'])} platform formats!")
            for out in rep["outputs"]:
                print(f"     - {out['platform'].upper()}: Score {out['consistency_score']}/100")
            assert len(rep["outputs"]) == 7

        # 5. Consistency evaluate
        print("5. Testing /api/content/evaluate...")
        eval_payload = json.dumps({
            "content_text": "We provide a cheap synergy platform to compound engineering velocity.",
            "platform": "linkedin"
        }).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/content/evaluate",
            data=eval_payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            eval_res = json.loads(resp.read().decode())
            print(f"   Evaluated Score: {eval_res['overall_score']}/100")
            print(f"   Avoid words flagged: {eval_res['avoid_words_found']}")
            print(f"   Keywords matched: {eval_res['vocabulary_used']}")
            assert len(eval_res["avoid_words_found"]) > 0

        # 6. Test SPA frontend serving
        print("6. Testing Frontend SPA delivery on root /...")
        req = urllib.request.Request("http://127.0.0.1:8000/")
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode()
            assert "BrandFlow AI" in html
            print("   SPA delivered successfully! HTML length:", len(html))

        print("\n>>> ALL API & FRONTEND SERVER TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        server.terminate()
        server.wait()

if __name__ == "__main__":
    run_test()
