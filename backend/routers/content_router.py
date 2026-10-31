import uuid
import json
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from database import get_connection, log_activity
from auth import get_current_user
from models import (
    ContentRepurposeRequest, RepurposeResponse, RepurposedOutput,
    ModifyContentRequest, ModifyContentResponse,
    ConsistencyCheckRequest, ConsistencyScoreResponse
)
from services.extractor_service import extract_content
from services.gemini_service import repurpose_content_for_platform, modify_content
from services.consistency_service import evaluate_consistency

router = APIRouter(prefix="/api/content", tags=["Content Processing & Repurposing"])

@router.post("/upload")
async def upload_content_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts text, PDF, audio, and video uploads.
    Extracts text (or produces audio/video transcript) and returns extracted content for user review and editing.
    """
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    extracted_text, detected_type, metadata = extract_content(
        file_bytes=file_bytes,
        filename=file.filename or "unknown",
        content_type=file.content_type or ""
    )
    
    log_activity(current_user["id"], "Uploaded Content", f"Uploaded {file.filename} ({detected_type})")
    
    return {
        "status": "success",
        "filename": file.filename,
        "content_type": detected_type,
        "extracted_text": extracted_text,
        "metadata": metadata
    }

@router.post("/repurpose", response_model=RepurposeResponse)
def repurpose_content(
    request: ContentRepurposeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Transforms source content into selected platform formats according to persistent Brand Memory.
    """
    if not request.original_content.strip():
        raise HTTPException(status_code=400, detail="Original content cannot be empty.")
        
    conn = get_connection()
    cursor = conn.cursor()
    
    # Retrieve brand profile
    brand_profile = None
    if request.brand_profile_id:
        cursor.execute("SELECT * FROM brand_profiles WHERE id = ? AND user_id = ?", (request.brand_profile_id, current_user["id"]))
        row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    if not brand_profile:
        # Get active profile
        cursor.execute("SELECT * FROM brand_profiles WHERE user_id = ? AND is_active = 1 LIMIT 1", (current_user["id"],))
        row = cursor.fetchone()
        if not row:
            cursor.execute("SELECT * FROM brand_profiles WHERE user_id = ? LIMIT 1", (current_user["id"],))
            row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    # Default fallback brand memory if user has none
    if not brand_profile:
        brand_profile = {
            "id": "default",
            "brand_name": "BrandFlow AI",
            "description": "AI-powered creative acceleration",
            "industry": "Marketing & SaaS",
            "target_audience": "Modern founders, creators, and growth leaders",
            "brand_personality": "Visionary, authentic, authoritative, crisp",
            "tone_of_voice": "Direct, inspiring, value-packed",
            "writing_style": "High-impact hooks, clean bulleted frameworks, zero fluff",
            "preferred_vocabulary": "leverage, compounding, velocity, omnipresence",
            "words_to_avoid": "synergy, paradigm shift, game changer",
            "brand_guidelines": "Maintain clean aesthetic, emphasize genuine utility, always respect reader attention.",
            "brand_colors": "#6366F1, #3B82F6, #1E1B4B",
            "sample_content": "We do not sell features; we engineer creative leverage."
        }
        
    project_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    title = request.title or "Repurposed Campaign"
    
    # Save project to database
    cursor.execute("""
    INSERT INTO projects (id, user_id, brand_profile_id, title, original_content, content_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (project_id, current_user["id"], brand_profile.get("id"), title, request.original_content, request.content_type, now, now))
    
    # Generate content for each requested platform
    outputs: List[RepurposedOutput] = []
    for platform in request.platforms:
        gen_result = repurpose_content_for_platform(
            original_content=request.original_content,
            platform=platform,
            brand_profile=brand_profile,
            language=request.language or "English"
        )
        
        # Save generated output in database
        gen_id = str(uuid.uuid4())
        cursor.execute("""
        INSERT INTO generated_contents (
            id, project_id, platform, output_text, consistency_score,
            score_breakdown, suggestions, language, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            gen_id, project_id, platform, gen_result["output_text"],
            gen_result["consistency_score"],
            json.dumps(gen_result["score_breakdown"]),
            json.dumps(gen_result["suggestions"]),
            request.language or "English",
            now, now
        ))
        
        outputs.append(RepurposedOutput(
            platform=platform,
            output_text=gen_result["output_text"],
            consistency_score=gen_result["consistency_score"],
            score_breakdown=gen_result["score_breakdown"],
            suggestions=gen_result["suggestions"],
            platform_meta=gen_result.get("platform_meta")
        ))
        
    conn.commit()
    conn.close()
    
    log_activity(
        current_user["id"],
        "Content Repurposed",
        f"Generated {len(outputs)} platform outputs for '{title}' using brand '{brand_profile.get('brand_name')}'"
    )
    
    return RepurposeResponse(
        project_id=project_id,
        title=title,
        original_content=request.original_content,
        brand_profile=brand_profile,
        outputs=outputs
    )

@router.post("/modify", response_model=ModifyContentResponse)
def modify_generated_content(
    request: ModifyContentRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Applies quick AI refinement actions: shorten, professional, casual, urgent, boost engagement, translate.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    brand_profile = None
    if request.brand_profile_id:
        cursor.execute("SELECT * FROM brand_profiles WHERE id = ? AND user_id = ?", (request.brand_profile_id, current_user["id"]))
        row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    if not brand_profile:
        cursor.execute("SELECT * FROM brand_profiles WHERE user_id = ? AND is_active = 1 LIMIT 1", (current_user["id"],))
        row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    conn.close()
    
    if not brand_profile:
        brand_profile = {"brand_name": "BrandFlow", "brand_personality": "Bold", "tone_of_voice": "Authoritative"}
        
    result = modify_content(
        content_text=request.content_text,
        action=request.action,
        brand_profile=brand_profile,
        target_language=request.target_language or "English",
        platform=request.platform or "general"
    )
    
    log_activity(current_user["id"], "Modified Content", f"Applied '{request.action}' modifier.")
    
    return ModifyContentResponse(
        modified_text=result["modified_text"],
        action=result["action"],
        consistency_score=result["consistency_score"]
    )

@router.post("/evaluate", response_model=ConsistencyScoreResponse)
def evaluate_brand_consistency(
    request: ConsistencyCheckRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Evaluates any text against the active Brand Memory profile and returns consistency score + suggestions.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    brand_profile = None
    if request.brand_profile_id:
        cursor.execute("SELECT * FROM brand_profiles WHERE id = ? AND user_id = ?", (request.brand_profile_id, current_user["id"]))
        row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    if not brand_profile:
        cursor.execute("SELECT * FROM brand_profiles WHERE user_id = ? AND is_active = 1 LIMIT 1", (current_user["id"],))
        row = cursor.fetchone()
        if row:
            brand_profile = dict(row)
            
    conn.close()
    
    if not brand_profile:
        brand_profile = {
            "brand_name": "BrandFlow AI",
            "brand_personality": "Dynamic, innovative",
            "tone_of_voice": "Engaging, professional",
            "writing_style": "Concise, actionable",
            "preferred_vocabulary": "growth, authority, leverage",
            "words_to_avoid": "synergy, rockstar",
            "brand_guidelines": "Be authentic and transparent."
        }
        
    result = evaluate_consistency(
        content_text=request.content_text,
        brand_profile=brand_profile,
        platform=request.platform
    )
    
    return ConsistencyScoreResponse(
        overall_score=result["overall_score"],
        tone_score=result["tone_score"],
        style_score=result["style_score"],
        vocabulary_score=result["vocabulary_score"],
        audience_score=result["audience_score"],
        guidelines_score=result["guidelines_score"],
        tone_analysis=result["tone_analysis"],
        vocabulary_used=result["vocabulary_used"],
        avoid_words_found=result["avoid_words_found"],
        suggestions=result["suggestions"],
        auto_fixed_version=result["auto_fixed_version"]
    )
