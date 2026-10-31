from fastapi import APIRouter, Depends
from database import get_connection
from auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["Dashboard Statistics"])

@router.get("/overview")
def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Total projects
    cursor.execute("SELECT COUNT(*) as count FROM projects WHERE user_id = ?", (current_user["id"],))
    projects_count = cursor.fetchone()["count"]
    
    # 2. Total generated content count
    cursor.execute("""
    SELECT COUNT(g.id) as count, AVG(g.consistency_score) as avg_score
    FROM generated_contents g
    JOIN projects p ON g.project_id = p.id
    WHERE p.user_id = ?
    """, (current_user["id"],))
    content_stats = cursor.fetchone()
    total_generated = content_stats["count"] or 0
    avg_score = round(content_stats["avg_score"] or 94, 1)
    
    # 3. Saved brand profiles count
    cursor.execute("SELECT COUNT(*) as count FROM brand_profiles WHERE user_id = ?", (current_user["id"],))
    brands_count = cursor.fetchone()["count"]
    
    # 4. Recent activities
    cursor.execute("""
    SELECT action, details, created_at 
    FROM activities 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 6
    """, (current_user["id"],))
    activities = [dict(r) for r in cursor.fetchall()]
    
    # 5. Active brand profile name
    cursor.execute("SELECT brand_name, brand_colors, tone_of_voice FROM brand_profiles WHERE user_id = ? AND is_active = 1 LIMIT 1", (current_user["id"],))
    active_brand = cursor.fetchone()
    
    conn.close()
    
    return {
        "projects_count": projects_count,
        "total_generated": total_generated,
        "brands_count": brands_count,
        "average_consistency_score": avg_score,
        "active_brand": dict(active_brand) if active_brand else None,
        "recent_activities": activities
    }
