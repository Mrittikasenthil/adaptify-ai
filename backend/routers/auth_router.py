import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from database import get_connection, log_activity
from auth import hash_password, verify_password, create_access_token, get_current_user
from models import UserRegister, UserLogin, UserResponse, Token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if email exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email.lower(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    hashed = hash_password(user_data.password)
    
    cursor.execute("""
    INSERT INTO users (id, email, password_hash, full_name, created_at)
    VALUES (?, ?, ?, ?, ?)
    """, (user_id, user_data.email.lower(), hashed, user_data.full_name, now))
    conn.commit()
    conn.close()
    
    log_activity(user_id, "Registered", f"User registered as {user_data.full_name}")
    
    token = create_access_token({"sub": user_id, "email": user_data.email.lower()})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user_data.email.lower(),
            "full_name": user_data.full_name,
            "created_at": now
        }
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, password_hash, full_name, created_at FROM users WHERE email = ?", (login_data.email.lower(),))
    row = cursor.fetchone()
    conn.close()
    
    if not row or not verify_password(login_data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    token = create_access_token({"sub": row["id"], "email": row["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": row["id"],
            "email": row["email"],
            "full_name": row["full_name"],
            "created_at": row["created_at"]
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "created_at": current_user.get("created_at", datetime.utcnow().isoformat())
    }
