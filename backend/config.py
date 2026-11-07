import os
import shutil
import secrets
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Load .env file if available
load_dotenv(BASE_DIR / ".env")

# Detect deployment environment
IS_VERCEL = bool(os.getenv("VERCEL"))

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Secret key handling: secure by default, avoids insecure static production strings
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if IS_VERCEL:
        SECRET_KEY = secrets.token_hex(32)
    else:
        SECRET_KEY = "adaptify-ai-local-dev-secret-key-not-for-production"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Database Configuration
# On Vercel Serverless, repository directory is read-only.
# We place SQLite in /tmp and copy pre-seeded data if available.
if IS_VERCEL:
    DB_PATH = Path("/tmp/brandflow.db")
    if not DB_PATH.exists() and (BASE_DIR / "brandflow.db").exists():
        try:
            shutil.copy2(BASE_DIR / "brandflow.db", DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = BASE_DIR / "brandflow.db"

DATABASE_URL = f"sqlite:///{DB_PATH}"

# Gemini Model selection
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Wispr Flow API Configuration (Optional: Wispr Flow works via focused dictation / Web Speech API)
WISPR_FLOW_API_KEY = os.getenv("WISPR_FLOW_API_KEY", "")
WISPR_FLOW_API_URL = os.getenv("WISPR_FLOW_API_URL", "https://platform-api.wisprflow.ai/api/v1/dash/api")
