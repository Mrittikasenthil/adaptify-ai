import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Load .env file
load_dotenv(BASE_DIR / ".env")

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DB_PATH = BASE_DIR / "brandflow.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Gemini Model selection
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Wispr Flow API Configuration
WISPR_FLOW_API_KEY = os.getenv("WISPR_FLOW_API_KEY", "")
WISPR_FLOW_API_URL = os.getenv("WISPR_FLOW_API_URL", "https://platform-api.wisprflow.ai/api/v1/dash/api")

