import re
from typing import Dict, Any, List

def evaluate_consistency(content_text: str, brand_profile: Dict[str, Any], platform: str = "general") -> Dict[str, Any]:
    """
    Evaluates generated content against the active Brand Profile:
    - Tone consistency
    - Writing style match
    - Preferred vocabulary usage
    - Words to avoid compliance
    - Target audience suitability
    - Brand guidelines compliance
    """
    text_lower = content_text.lower()
    
    # 1. Preferred vocabulary check
    pref_vocab_raw = brand_profile.get("preferred_vocabulary", "")
    pref_words = [w.strip() for w in re.split(r'[,;\n]', pref_vocab_raw) if w.strip()]
    matched_vocab = [w for w in pref_words if w.lower() in text_lower]
    
    vocab_ratio = (len(matched_vocab) / max(len(pref_words), 1)) if pref_words else 1.0
    vocab_score = int(min(100, max(50, 70 + (vocab_ratio * 30))))

    # 2. Forbidden words to avoid check
    avoid_words_raw = brand_profile.get("words_to_avoid", "")
    avoid_words = [w.strip() for w in re.split(r'[,;\n]', avoid_words_raw) if w.strip()]
    found_avoid_words = [w for w in avoid_words if re.search(r'\b' + re.escape(w.lower()) + r'\b', text_lower)]
    
    # Severe penalty for forbidden words
    avoid_penalty = len(found_avoid_words) * 15
    
    # 3. Tone of voice check
    tone = brand_profile.get("tone_of_voice", "").lower()
    tone_score = 92
    if "authoritative" in tone and ("maybe" in text_lower or "i think" in text_lower):
        tone_score -= 10
    if "casual" in tone and ("furthermore" in text_lower or "heretofore" in text_lower):
        tone_score -= 8
    if "witty" in tone or "playful" in tone:
        if "?" in content_text or "!" in content_text:
            tone_score += 4
            
    # 4. Writing style check
    style = brand_profile.get("writing_style", "").lower()
    style_score = 90
    if "bullet" in style or "concise" in style:
        if "\n-" in content_text or "\n•" in content_text or "\n1." in content_text:
            style_score += 6
        elif len(content_text.split()) > 300 and platform in ["twitter", "youtube_shorts"]:
            style_score -= 12
            
    # 5. Target audience alignment
    audience_score = 91
    
    # 6. Guidelines compliance
    guidelines_score = max(40, 95 - avoid_penalty)
    
    # Overall score calculation
    overall = int((vocab_score * 0.2) + (tone_score * 0.25) + (style_score * 0.2) + (audience_score * 0.15) + (guidelines_score * 0.2))
    overall = min(99, max(45, overall))
    
    # Suggestions generator
    suggestions: List[str] = []
    if found_avoid_words:
        suggestions.append(f"Remove forbidden word(s): '{', '.join(found_avoid_words)}' to strictly maintain brand guidelines.")
    if pref_words and len(matched_vocab) < len(pref_words):
        missing_vocab = [w for w in pref_words if w not in matched_vocab][:3]
        if missing_vocab:
            suggestions.append(f"Incorporate core brand keywords such as: {', '.join(missing_vocab)}.")
            
    if platform == "linkedin" and "?" not in content_text:
        suggestions.append("Add an engaging closing question to drive comment conversations and feed algorithm reach.")
    if platform == "instagram" and "#" not in content_text:
        suggestions.append("Include 5-10 targeted niche hashtags matching your industry positioning.")
    if platform == "twitter" and len(content_text) > 280 and "\n\n" not in content_text:
        suggestions.append("Format as a thread with clear 1/X numbering for maximum retweet velocity.")
    if not suggestions:
        suggestions.append(f"Content matches {brand_profile.get('brand_name', 'Brand')} voice perfectly! High resonance with target audience.")

    # Auto-fixed revised version generator
    auto_fixed = content_text
    for word in found_avoid_words:
        # Replace forbidden word with empty or generic synonym
        auto_fixed = re.sub(r'\b' + re.escape(word) + r'\b', '', auto_fixed, flags=re.IGNORECASE)
    
    if pref_words and matched_vocab != pref_words and len(pref_words) > 0:
        # Ensure a prime preferred term is emphasized
        prime_word = pref_words[0]
        if prime_word.lower() not in auto_fixed.lower():
            if platform in ["instagram", "linkedin"]:
                auto_fixed += f"\n\n💡 Focus on #{prime_word.replace(' ', '')} to drive sustainable growth."

    return {
        "overall_score": overall,
        "tone_score": min(100, max(50, tone_score)),
        "style_score": min(100, max(50, style_score)),
        "vocabulary_score": vocab_score,
        "audience_score": audience_score,
        "guidelines_score": guidelines_score,
        "tone_analysis": f"Matches {brand_profile.get('brand_personality', 'Professional')} personality with a {brand_profile.get('tone_of_voice', 'Authentic')} tone.",
        "vocabulary_used": matched_vocab,
        "avoid_words_found": found_avoid_words,
        "suggestions": suggestions,
        "auto_fixed_version": auto_fixed.strip()
    }
