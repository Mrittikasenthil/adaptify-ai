import json
import time
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline():
    print("\n--- 1. Testing Health Endpoint ---")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    health_data = r.json()
    print("Health Status:", health_data)
    assert health_data["status"] == "healthy"

    print("\n--- 2. Testing Auth: Registration & Login ---")
    test_email = f"test_{int(time.time())}@brandflow.ai"
    reg_r = client.post("/api/auth/register", json={
        "email": test_email,
        "password": "Password123!",
        "full_name": "Test Persona"
    })
    assert reg_r.status_code == 200, f"Registration failed: {reg_r.text}"
    token = reg_r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("User registered and token received successfully.")

    me_r = client.get("/api/auth/me", headers=headers)
    assert me_r.status_code == 200
    assert me_r.json()["email"] == test_email
    print("Current User Profile Verified:", me_r.json()["full_name"])

    print("\n--- 3. Testing Brand Memory Profiles ---")
    brands_r = client.get("/api/brand-memory", headers=headers)
    assert brands_r.status_code == 200
    print(f"Retrieved {len(brands_r.json())} brand profiles.")

    # Create custom brand profile
    new_brand = {
        "brand_name": "CyberPulse Security",
        "description": "Zero-trust cybersecurity intelligence for enterprise infrastructure.",
        "industry": "Cybersecurity",
        "target_audience": "CISOs, SecOps teams, and cloud security architects",
        "brand_personality": "Vigilant, authoritative, sharp, mission-critical",
        "tone_of_voice": "Uncompromising, direct, urgent yet deeply reassuring",
        "writing_style": "Data-backed risk frameworks, concise tactical steps, zero fluff",
        "preferred_vocabulary": "zero-trust, telemetry, attack surface, posture, resilience, air-gap",
        "words_to_avoid": "cheap, easy, hack, magic, revolutionary",
        "brand_guidelines": "Never downplay threats. Present clear, actionable containment protocols.",
        "brand_colors": "#0F172A, #EF4444, #10B981",
        "sample_content": "Perimeters do not stop modern adversaries; continuous identity verification does.",
        "is_active": True
    }
    create_b_r = client.post("/api/brand-memory", json=new_brand, headers=headers)
    assert create_b_r.status_code == 200, f"Brand creation failed: {create_b_r.text}"
    created_brand_id = create_b_r.json()["id"]
    print("Created Brand Memory:", create_b_r.json()["brand_name"], f"(ID: {created_brand_id})")

    # Check active profile
    active_r = client.get("/api/brand-memory/active", headers=headers)
    assert active_r.status_code == 200
    assert active_r.json()["brand_name"] == "CyberPulse Security"
    print("Active Brand Memory confirmed:", active_r.json()["brand_name"])

    print("\n--- 4. Testing Content Upload (Text / Simulated Transcript) ---")
    sample_file_content = b"Zero-trust architecture is no longer optional. Modern threat vectors exploit stale credentials. Teams must enforce continuous telemetry and reduce the attack surface."
    upload_r = client.post(
        "/api/content/upload",
        files={"file": ("security_bulletin.txt", sample_file_content, "text/plain")},
        headers=headers
    )
    assert upload_r.status_code == 200, f"Upload failed: {upload_r.text}"
    extracted_text = upload_r.json()["extracted_text"]
    print("Uploaded File Extracted Content:", extracted_text[:80], "...")

    print("\n--- 5. Testing Content Repurposing (All 7 Platforms) ---")
    repurpose_payload = {
        "original_content": extracted_text,
        "title": "Zero-Trust Architecture Threat Analysis",
        "content_type": "text",
        "brand_profile_id": created_brand_id,
        "platforms": ["linkedin", "twitter", "instagram", "youtube_shorts", "blog", "newsletter", "ad"],
        "language": "English"
    }
    repurpose_r = client.post("/api/content/repurpose", json=repurpose_payload, headers=headers)
    assert repurpose_r.status_code == 200, f"Repurposing failed: {repurpose_r.text}"
    rep_data = repurpose_r.json()
    project_id = rep_data["project_id"]
    print(f"Successfully generated {len(rep_data['outputs'])} platform formats for project '{rep_data['title']}'!")

    for out in rep_data["outputs"]:
        print(f"  ✓ {out['platform'].upper():15} | Score: {out['consistency_score']}/100 | Words: {len(out['output_text'].split())}")

    print("\n--- 6. Testing Brand Consistency Checker ---")
    audit_r = client.post("/api/content/evaluate", json={
        "content_text": "We provide a magic and cheap zero-trust solution with high telemetry to minimize attack surface.",
        "platform": "linkedin",
        "brand_profile_id": created_brand_id
    }, headers=headers)
    assert audit_r.status_code == 200
    audit_res = audit_r.json()
    print("Audit Score:", audit_res["overall_score"], "/ 100")
    print("Avoid words detected:", audit_res["avoid_words_found"])
    assert "magic" in audit_res["avoid_words_found"] or "cheap" in audit_res["avoid_words_found"]
    print("Auto-fixed Version:\n", audit_res["auto_fixed_version"])

    print("\n--- 7. Testing AI Content Modifiers (Shorten, Professional, Translate) ---")
    mod_short_r = client.post("/api/content/modify", json={
        "content_text": rep_data["outputs"][0]["output_text"],
        "action": "shorter",
        "platform": "linkedin",
        "brand_profile_id": created_brand_id
    }, headers=headers)
    assert mod_short_r.status_code == 200
    print("Shortened Output Snippet:", mod_short_r.json()["modified_text"][:100], "...")

    mod_tamil_r = client.post("/api/content/modify", json={
        "content_text": rep_data["outputs"][0]["output_text"],
        "action": "translate",
        "target_language": "Tamil",
        "platform": "linkedin",
        "brand_profile_id": created_brand_id
    }, headers=headers)
    assert mod_tamil_r.status_code == 200
    print("Tamil Translated Snippet:\n", mod_tamil_r.json()["modified_text"][:120], "...")

    print("\n--- 8. Testing Projects & Dashboard Overview ---")
    projects_r = client.get("/api/projects", headers=headers)
    assert projects_r.status_code == 200
    print(f"Total Projects in Archive: {len(projects_r.json())}")

    stats_r = client.get("/api/stats/overview", headers=headers)
    assert stats_r.status_code == 200
    stats_data = stats_r.json()
    print("Stats Overview:", {
        "projects_count": stats_data["projects_count"],
        "total_generated": stats_data["total_generated"],
        "brands_count": stats_data["brands_count"],
        "average_consistency_score": stats_data["average_consistency_score"]
    })

    print("\n🎉 ALL PIPELINE TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_full_pipeline()
