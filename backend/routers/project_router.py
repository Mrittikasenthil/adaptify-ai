import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import PlainTextResponse
from database import get_connection, log_activity
from auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["Projects & History"])

@router.get("")
def list_projects(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.*, b.brand_name, COUNT(g.id) as outputs_count
    FROM projects p
    LEFT JOIN brand_profiles b ON p.brand_profile_id = b.id
    LEFT JOIN generated_contents g ON p.id = g.project_id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.updated_at DESC
    """, (current_user["id"],))
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]

@router.get("/{project_id}")
def get_project_details(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Project info
    cursor.execute("""
    SELECT p.*, b.brand_name, b.brand_personality, b.tone_of_voice
    FROM projects p
    LEFT JOIN brand_profiles b ON p.brand_profile_id = b.id
    WHERE p.id = ? AND p.user_id = ?
    """, (project_id, current_user["id"]))
    project_row = cursor.fetchone()
    
    if not project_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found.")
        
    # Generated outputs
    cursor.execute("""
    SELECT * FROM generated_contents 
    WHERE project_id = ? 
    ORDER BY created_at ASC
    """, (project_id,))
    output_rows = cursor.fetchall()
    conn.close()
    
    outputs = []
    for out in output_rows:
        item = dict(out)
        try:
            item["score_breakdown"] = json.loads(item["score_breakdown"]) if item.get("score_breakdown") else {}
        except Exception:
            item["score_breakdown"] = {}
        try:
            item["suggestions"] = json.loads(item["suggestions"]) if item.get("suggestions") else []
        except Exception:
            item["suggestions"] = []
        outputs.append(item)
        
    return {
        "project": dict(project_row),
        "outputs": outputs
    }

@router.put("/{project_id}/outputs/{output_id}")
def update_generated_output(
    project_id: str,
    output_id: str,
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    new_text = data.get("output_text")
    if not new_text:
        raise HTTPException(status_code=400, detail="output_text is required.")
        
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE generated_contents
    SET output_text = ?, updated_at = ?
    WHERE id = ? AND project_id = ?
    """, (new_text, datetime.utcnow().isoformat(), output_id, project_id))
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    if not updated:
        raise HTTPException(status_code=404, detail="Output record not found.")
        
    return {"status": "success", "message": "Content updated"}

@router.delete("/{project_id}")
def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM generated_contents WHERE project_id = ?", (project_id,))
    cursor.execute("DELETE FROM projects WHERE id = ? AND user_id = ?", (project_id, current_user["id"]))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Project deleted"}

@router.get("/{project_id}/export/txt")
def export_project_txt(project_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.*, b.brand_name
    FROM projects p
    LEFT JOIN brand_profiles b ON p.brand_profile_id = b.id
    WHERE p.id = ? AND p.user_id = ?
    """, (project_id, current_user["id"]))
    proj = cursor.fetchone()
    if not proj:
        conn.close()
        raise HTTPException(status_code=404, detail="Project not found.")
        
    cursor.execute("SELECT * FROM generated_contents WHERE project_id = ?", (project_id,))
    outputs = cursor.fetchall()
    conn.close()
    
    lines = [
        f"===========================================================",
        f"BRANDFLOW AI REPURPOSED EXPORT",
        f"Project: {proj['title']}",
        f"Brand Memory: {proj['brand_name'] or 'Default'}",
        f"Created: {proj['created_at']}",
        f"===========================================================",
        "\n--- ORIGINAL SOURCE CONTENT ---",
        proj["original_content"],
        "\n==========================================================="
    ]
    
    for out in outputs:
        lines.append(f"\n--- PLATFORM: {out['platform'].upper()} (Score: {out['consistency_score']}/100) ---")
        lines.append(out["output_text"])
        lines.append("\n" + ("-" * 40))
        
    content_str = "\n".join(lines)
    return PlainTextResponse(
        content=content_str,
        headers={"Content-Disposition": f"attachment; filename=brandflow_{project_id[:8]}.txt"}
    )
