import sqlite3
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Brand Profiles table (Brand Memory)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brand_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        description TEXT NOT NULL,
        industry TEXT NOT NULL,
        target_audience TEXT NOT NULL,
        brand_personality TEXT NOT NULL,
        tone_of_voice TEXT NOT NULL,
        writing_style TEXT NOT NULL,
        preferred_vocabulary TEXT NOT NULL,
        words_to_avoid TEXT NOT NULL,
        brand_guidelines TEXT NOT NULL,
        brand_colors TEXT NOT NULL,
        sample_content TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Projects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        brand_profile_id TEXT,
        title TEXT NOT NULL,
        original_content TEXT NOT NULL,
        content_type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Generated Content table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS generated_contents (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        output_text TEXT NOT NULL,
        consistency_score INTEGER DEFAULT 0,
        score_breakdown TEXT,
        suggestions TEXT,
        language TEXT DEFAULT 'English',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(project_id) REFERENCES projects(id)
    )
    """)

    # Activities table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Adaptify AI - Study Materials table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_materials (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size TEXT,
        source_type TEXT NOT NULL,
        extracted_text TEXT NOT NULL,
        status TEXT NOT NULL,
        duration_or_pages TEXT,
        is_sample INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Adaptify AI - Saved Notes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        material_id TEXT,
        title TEXT NOT NULL,
        notes_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Adaptify AI - Quiz Sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        topic TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Adaptify AI - Learner Progress table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS learner_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        topic TEXT NOT NULL,
        mastery_score INTEGER NOT NULL,
        weak_concepts TEXT,
        recommended_actions TEXT,
        updated_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

def log_activity(user_id: str, action: str, details: str):
    import uuid
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO activities (id, user_id, action, details, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), user_id, action, details, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
