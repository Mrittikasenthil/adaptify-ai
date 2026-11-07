import hashlib
import hmac
import base64
import json
import time
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_connection

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = "brandflow_secure_salt_2026"
    return hashlib.sha256(f"{password}_{salt}".encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    payload = data.copy()
    payload["exp"] = int(time.time()) + (expires_delta_minutes * 60)
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signing_input = f"{header_b64}.{payload_b64}".encode()
    signature = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_token(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode()
        expected_sig = hmac.new(SECRET_KEY.encode(), signing_input, hashlib.sha256).digest()
        
        # Pad signature if needed
        padding = 4 - (len(sig_b64) % 4)
        if padding < 4:
            sig_b64 += "=" * padding
        actual_sig = base64.urlsafe_b64decode(sig_b64.encode())
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        # Pad payload
        padding = 4 - (len(payload_b64) % 4)
        if padding < 4:
            payload_b64 += "=" * padding
        payload = json.loads(base64.urlsafe_b64decode(payload_b64.encode()).decode())
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Dict[str, Any]:
    # Fallback default demo user if no token provided or demo mode
    demo_user = {
        "id": "demo-user-id",
        "email": "mrittika@adaptify.ai",
        "full_name": "Mrittika",
        "created_at": "2026-01-01T00:00:00"
    }
    
    if not credentials:
        return demo_user
        
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        return demo_user
        
    user_id = payload.get("sub")
    if not user_id:
        return demo_user
        
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return demo_user
        
    return dict(row)
