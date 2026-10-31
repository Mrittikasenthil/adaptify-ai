import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from database import get_connection, log_activity
from auth import get_current_user
from models import BrandProfileCreate, BrandProfileUpdate, BrandProfileResponse

router = APIRouter(prefix="/api/brand-memory", tags=["Brand Memory"])

@router.get("", response_model=List[BrandProfileResponse])
def get_brand_profiles(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM brand_profiles 
    WHERE user_id = ? 
    ORDER BY is_active DESC, updated_at DESC
    """, (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            **dict(r),
            "is_active": bool(r["is_active"])
        }
        for r in rows
    ]

@router.get("/active", response_model=BrandProfileResponse)
def get_active_brand_profile(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM brand_profiles 
    WHERE user_id = ? AND is_active = 1
    LIMIT 1
    """, (current_user["id"],))
    row = cursor.fetchone()
    
    # If no profile active, get first available
    if not row:
        cursor.execute("SELECT * FROM brand_profiles WHERE user_id = ? LIMIT 1", (current_user["id"],))
        row = cursor.fetchone()
        
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="No brand profile found. Please create one.")
        
    return {**dict(row), "is_active": bool(row["is_active"])}

@router.post("", response_model=BrandProfileResponse)
def create_brand_profile(profile_data: BrandProfileCreate, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    
    profile_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # If this is set as active, deactivate others
    if profile_data.is_active:
        cursor.execute("UPDATE brand_profiles SET is_active = 0 WHERE user_id = ?", (current_user["id"],))
    else:
        # Check if user has any existing profiles. If not, make this one active by default
        cursor.execute("SELECT COUNT(*) as cnt FROM brand_profiles WHERE user_id = ?", (current_user["id"],))
        if cursor.fetchone()["cnt"] == 0:
            profile_data.is_active = True
            
    cursor.execute("""
    INSERT INTO brand_profiles (
        id, user_id, brand_name, description, industry, target_audience,
        brand_personality, tone_of_voice, writing_style, preferred_vocabulary,
        words_to_avoid, brand_guidelines, brand_colors, sample_content,
        is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        profile_id, current_user["id"], profile_data.brand_name, profile_data.description,
        profile_data.industry, profile_data.target_audience, profile_data.brand_personality,
        profile_data.tone_of_voice, profile_data.writing_style, profile_data.preferred_vocabulary,
        profile_data.words_to_avoid, profile_data.brand_guidelines, profile_data.brand_colors,
        profile_data.sample_content, 1 if profile_data.is_active else 0, now, now
    ))
    conn.commit()
    conn.close()
    
    log_activity(current_user["id"], "Created Brand Profile", f"Profile '{profile_data.brand_name}' created.")
    
    return {
        "id": profile_id,
        "user_id": current_user["id"],
        **profile_data.dict(),
        "created_at": now,
        "updated_at": now
    }

@router.put("/{profile_id}", response_model=BrandProfileResponse)
def update_brand_profile(profile_id: str, update_data: BrandProfileUpdate, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM brand_profiles WHERE id = ? AND user_id = ?", (profile_id, current_user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Brand profile not found.")
        
    current_dict = dict(row)
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    
    if update_dict.get("is_active"):
        cursor.execute("UPDATE brand_profiles SET is_active = 0 WHERE user_id = ?", (current_user["id"],))
        
    merged = {**current_dict, **update_dict}
    now = datetime.utcnow().isoformat()
    
    cursor.execute("""
    UPDATE brand_profiles SET
        brand_name = ?, description = ?, industry = ?, target_audience = ?,
        brand_personality = ?, tone_of_voice = ?, writing_style = ?,
        preferred_vocabulary = ?, words_to_avoid = ?, brand_guidelines = ?,
        brand_colors = ?, sample_content = ?, is_active = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
    """, (
        merged["brand_name"], merged["description"], merged["industry"], merged["target_audience"],
        merged["brand_personality"], merged["tone_of_voice"], merged["writing_style"],
        merged["preferred_vocabulary"], merged["words_to_avoid"], merged["brand_guidelines"],
        merged["brand_colors"], merged["sample_content"], 1 if merged["is_active"] else 0,
        now, profile_id, current_user["id"]
    ))
    conn.commit()
    conn.close()
    
    log_activity(current_user["id"], "Updated Brand Profile", f"Profile '{merged['brand_name']}' updated.")
    
    return {
        **merged,
        "is_active": bool(merged["is_active"]),
        "updated_at": now
    }

@router.post("/{profile_id}/activate")
def activate_brand_profile(profile_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT brand_name FROM brand_profiles WHERE id = ? AND user_id = ?", (profile_id, current_user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Brand profile not found.")
        
    cursor.execute("UPDATE brand_profiles SET is_active = 0 WHERE user_id = ?", (current_user["id"],))
    cursor.execute("UPDATE brand_profiles SET is_active = 1 WHERE id = ? AND user_id = ?", (profile_id, current_user["id"]))
    conn.commit()
    conn.close()
    
    log_activity(current_user["id"], "Activated Brand Profile", f"Active profile set to '{row['brand_name']}'")
    return {"status": "success", "message": f"Brand profile '{row['brand_name']}' activated"}

@router.delete("/{profile_id}")
def delete_brand_profile(profile_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM brand_profiles WHERE id = ? AND user_id = ?", (profile_id, current_user["id"]))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Brand profile not found.")
        
    return {"status": "success", "message": "Brand profile deleted"}
