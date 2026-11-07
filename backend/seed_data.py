import uuid
import json
from datetime import datetime, timedelta
from database import get_connection
from auth import hash_password

def seed_initial_data():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Create demo user
    demo_user_id = "demo-user-id"
    cursor.execute("SELECT id FROM users WHERE id = ?", (demo_user_id,))
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, full_name, created_at)
        VALUES (?, ?, ?, ?, ?)
        """, (
            demo_user_id,
            "mrittika@adaptify.ai",
            hash_password("password123"),
            "Mrittika",
            datetime.utcnow().isoformat()
        ))
        
    # 2. Check if brand profiles exist for demo user
    cursor.execute("SELECT COUNT(*) as count FROM brand_profiles WHERE user_id = ?", (demo_user_id,))
    if cursor.fetchone()["count"] == 0:
        brand1_id = str(uuid.uuid4())
        brand2_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        # Profile 1: Apex SaaS
        cursor.execute("""
        INSERT INTO brand_profiles (
            id, user_id, brand_name, description, industry, target_audience,
            brand_personality, tone_of_voice, writing_style, preferred_vocabulary,
            words_to_avoid, brand_guidelines, brand_colors, sample_content,
            is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            brand1_id, demo_user_id,
            "Apex Cloud & AI",
            "Next-generation distributed cloud infrastructure and automated AI observability platform.",
            "Enterprise Software / SaaS",
            "CTOs, VP of Engineering, DevOps architects, and technical founders",
            "Authoritative, sleek, developer-obsessed, uncompromising on performance",
            "Visionary, direct, intellectually honest, value-packed",
            "Framework-first, concise bullets, zero corporate fluff, data-backed assertions",
            "telemetry, architectural moat, compounding, velocity, resilience, leverage",
            "game changer, synergy, rockstar, ninja, magic, revolutionary",
            "Always lead with measurable uptime and system leverage. Never use hollow marketing superlatives. Respect the engineering audience's intelligence.",
            "#6366F1, #3B82F6, #06B6D4",
            "Engineers do not care about buzzwords; they care about latency, predictability, and system reliability. We build infrastructure that gives teams their weekends back.",
            1, now, now
        ))
        
        # Profile 2: EcoVibe Organics
        cursor.execute("""
        INSERT INTO brand_profiles (
            id, user_id, brand_name, description, industry, target_audience,
            brand_personality, tone_of_voice, writing_style, preferred_vocabulary,
            words_to_avoid, brand_guidelines, brand_colors, sample_content,
            is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            brand2_id, demo_user_id,
            "EcoVibe Living",
            "Sustainable home essentials and organic regenerative wellness products.",
            "Consumer Goods / Eco-Lifestyle",
            "Conscious consumers, mindful homeowners, zero-waste advocates, and wellness enthusiasts",
            "Warm, earthy, inspiring, transparent, holistic, deeply grounded",
            "Conversational, gentle, empathetic, uplifting, community-first",
            "Mindful storytelling, sensory descriptions, thoughtful reflections",
            "regenerative, mindful, conscious living, earth-first, harmony, botanical, ritual",
            "urgent, cheap, hurry, plastic, chemical, industrial, toxic",
            "Celebrate nature and human connection. Maintain calm, restorative visual aesthetics and thoughtful cadence.",
            "#10B981, #059669, #F59E0B",
            "Small conscious choices quietly ripple into monumental environmental healing. Every refill is a gentle act of stewardship for tomorrow.",
            0, now, now
        ))
        
        # 3. Create a sample project with generated outputs
        proj_id = str(uuid.uuid4())
        cursor.execute("""
        INSERT INTO projects (id, user_id, brand_profile_id, title, original_content, content_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            proj_id, demo_user_id, brand1_id,
            "Mastering System Velocity & AI Architecture",
            "Modern software teams struggle with cloud fragmentation. Rather than adding more observability tabs, teams need unified telemetry and automated root cause analysis. This compounds engineering velocity by 40% and builds an architectural moat that competitors cannot easily copy.",
            "text", now, now
        ))
        
        # Add generated outputs for LinkedIn, Twitter, Instagram
        cursor.execute("""
        INSERT INTO generated_contents (
            id, project_id, platform, output_text, consistency_score, score_breakdown, suggestions, language, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), proj_id, "linkedin",
            """90% of engineering leadership is fighting fragmentation, not writing code.

Teams keep adding new observability dashboards hoping for clarity.
The result? More alert fatigue and slower release cycles.

Here is how modern infrastructure leaders build an architectural moat:

1. Unified Telemetry Over Dashboard Proliferation
When your logs, metrics, and traces live in one unified pipeline, debugging time drops by 60%.

2. Automate Root-Cause Correlation
Humans shouldn't manually grep through millions of log lines at 2 AM.

3. Prioritize Compounding Velocity
The goal isn't just uptime—it is giving your engineers the confidence to ship daily.

What's the single biggest blindspot in your cloud monitoring stack today?

#CloudArchitecture #DevOps #EngineeringLeadership #ApexCloud""",
            96,
            json.dumps({"tone": 98, "style": 95, "vocabulary": 96, "audience": 95, "guidelines": 96}),
            json.dumps(["Strong architectural tone alignment", "High engineering resonance"]),
            "English", now, now
        ))
        
        cursor.execute("""
        INSERT INTO generated_contents (
            id, project_id, platform, output_text, consistency_score, score_breakdown, suggestions, language, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), proj_id, "twitter",
            """1/3 The biggest lie in cloud computing: "Just buy another monitoring tool."

Here is how the top 1% of engineering teams reduce alert fatigue and unlock compounding velocity 🧵

2/3 More dashboards don't equal more visibility. They equal cognitive overload.
True resilience requires unified telemetry and automated root-cause detection.

3/3 Stop grepping logs at 3 AM. Build an architectural moat that lets your developers sleep through the night.

Follow @apexcloud for modern cloud systems architecture playbooks.""",
            94,
            json.dumps({"tone": 95, "style": 96, "vocabulary": 92, "audience": 94, "guidelines": 93}),
            json.dumps(["Brevity and thread structure are well optimized"]),
            "English", now, now
        ))

        # Add initial activity log
        cursor.execute("""
        INSERT INTO activities (id, user_id, action, details, created_at)
        VALUES (?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), demo_user_id, "Workspace Initialized", "BrandFlow AI studio configured with sample Brand Memories.", now))

    conn.commit()
    conn.close()
