from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# User & Auth
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Brand Memory Profile
class BrandProfileCreate(BaseModel):
    brand_name: str
    description: str
    industry: str
    target_audience: str
    brand_personality: str
    tone_of_voice: str
    writing_style: str
    preferred_vocabulary: str  # Comma-separated or lines
    words_to_avoid: str        # Comma-separated or lines
    brand_guidelines: str
    brand_colors: str          # Hex codes or names, e.g. "#6366F1, #3B82F6, #1E1B4B"
    sample_content: str
    is_active: Optional[bool] = False

class BrandProfileUpdate(BaseModel):
    brand_name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    brand_personality: Optional[str] = None
    tone_of_voice: Optional[str] = None
    writing_style: Optional[str] = None
    preferred_vocabulary: Optional[str] = None
    words_to_avoid: Optional[str] = None
    brand_guidelines: Optional[str] = None
    brand_colors: Optional[str] = None
    sample_content: Optional[str] = None
    is_active: Optional[bool] = None

class BrandProfileResponse(BaseModel):
    id: str
    user_id: str
    brand_name: str
    description: str
    industry: str
    target_audience: str
    brand_personality: str
    tone_of_voice: str
    writing_style: str
    preferred_vocabulary: str
    words_to_avoid: str
    brand_guidelines: str
    brand_colors: str
    sample_content: str
    is_active: bool
    created_at: str
    updated_at: str

# Repurposing & Generation
class ContentRepurposeRequest(BaseModel):
    original_content: str
    title: Optional[str] = "Untitled Transformation"
    content_type: Optional[str] = "text"
    brand_profile_id: Optional[str] = None
    platforms: List[str] = Field(
        default=["instagram", "linkedin", "twitter", "youtube_shorts", "blog", "newsletter", "ad"]
    )
    language: Optional[str] = "English"

class RepurposedOutput(BaseModel):
    platform: str
    output_text: str
    consistency_score: int
    score_breakdown: Dict[str, int]
    suggestions: List[str]
    platform_meta: Optional[Dict[str, Any]] = None

class RepurposeResponse(BaseModel):
    project_id: str
    title: str
    original_content: str
    brand_profile: Optional[Dict[str, Any]] = None
    outputs: List[RepurposedOutput]

# Consistency Check
class ConsistencyCheckRequest(BaseModel):
    content_text: str
    platform: str
    brand_profile_id: Optional[str] = None

class ConsistencyScoreResponse(BaseModel):
    overall_score: int
    tone_score: int
    style_score: int
    vocabulary_score: int
    audience_score: int
    guidelines_score: int
    tone_analysis: str
    vocabulary_used: List[str]
    avoid_words_found: List[str]
    suggestions: List[str]
    auto_fixed_version: Optional[str] = None

# Content Modification
class ModifyContentRequest(BaseModel):
    content_text: str
    action: str  # "shorter", "more_professional", "casual", "urgent", "boost_engagement", "translate"
    target_language: Optional[str] = "English"
    platform: Optional[str] = "general"
    brand_profile_id: Optional[str] = None

class ModifyContentResponse(BaseModel):
    modified_text: str
    action: str
    consistency_score: int

# Projects & History
class ProjectResponse(BaseModel):
    id: str
    user_id: str
    brand_profile_id: Optional[str]
    brand_name: Optional[str]
    title: str
    original_content: str
    content_type: str
    created_at: str
    updated_at: str
    outputs_count: int = 0
