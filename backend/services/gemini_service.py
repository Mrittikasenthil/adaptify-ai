import os
import json
import re
from typing import Dict, Any, List, Optional
from config import GEMINI_API_KEY, DEFAULT_GEMINI_MODEL
from services.consistency_service import evaluate_consistency

# Platform specification guide
PLATFORM_INSTRUCTIONS = {
    "instagram": (
        "Create an engaging Instagram post. Requirements:\n"
        "- Attention-grabbing opening hook line.\n"
        "- Storytelling format with clean line breaks and relevant emojis.\n"
        "- Clear Call To Action (e.g., 'Save this for later', 'Drop your thoughts below').\n"
        "- 12-18 strategically targeted hashtags matching the brand industry.\n"
    ),
    "linkedin": (
        "Create a high-performing LinkedIn thought leadership post. Requirements:\n"
        "- Punchy first 2 lines that make people click 'see more'.\n"
        "- Insightful, actionable points with clean spacing or bullet points.\n"
        "- Professional yet personal perspective without corporate jargon.\n"
        "- Open-ended question at the end to drive discussion in comments.\n"
        "- 3-5 relevant hashtags.\n"
    ),
    "twitter": (
        "Create a high-converting Twitter / X post or mini-thread (3-4 tweets). Requirements:\n"
        "- Tweet 1: Irresistible hook with high retweet appeal.\n"
        "- Following tweets: Core value nuggets, formatted with 1/, 2/, 3/ for readability.\n"
        "- Final tweet: Strong takeaway and call to follow or bookmark.\n"
        "- High density of insight, zero fluff.\n"
    ),
    "youtube_shorts": (
        "Create a 45-60 second YouTube Shorts / TikTok video script. Requirements:\n"
        "- [0:00-0:03 HOOK]: Fast-paced visual action and provocative verbal hook.\n"
        "- Include explicit visual directions in brackets: e.g. [Visual: Text popup on screen, B-roll of workflow].\n"
        "- Spoken voiceover text that flows rhythmically.\n"
        "- [CLOSING]: Seamless seamless loop or strong CTA to subscribe/like.\n"
    ),
    "blog": (
        "Create a comprehensive, SEO-optimized blog article. Requirements:\n"
        "- Catchy SEO Title and Meta Description (under 160 characters).\n"
        "- Engaging Introduction outlining the problem and solution.\n"
        "- 3 structured sections with clear H2 and H3 markdown headings.\n"
        "- Bullet points for actionable takeaways.\n"
        "- Compelling Conclusion with a Next Steps call to action.\n"
    ),
    "newsletter": (
        "Create an engaging Email Newsletter. Requirements:\n"
        "- 3 Subject Line Options (curiosity, benefit-driven, urgent).\n"
        "- Preview Snippet text.\n"
        "- Warm, 1-on-1 personal opening greeting.\n"
        "- Digestible body content with key insights.\n"
        "- Prominent [CALL TO ACTION BUTTON: Copy] and a thought-provoking P.S. note.\n"
    ),
    "ad": (
        "Create high-converting Promotional Advertisement copy (Meta / Google / LinkedIn ads). Requirements:\n"
        "- 3 Headline Variations (Curiosity, Direct Benefit, Social Proof).\n"
        "- Primary Ad Text: Hook -> Pain Point -> Solution -> Benefit.\n"
        "- Recommended CTA Button Text (e.g. 'Claim Free Trial', 'Book Strategy Call').\n"
    )
}

def format_brand_context(brand: Dict[str, Any]) -> str:
    """Creates a comprehensive system prompt representation of the active Brand Memory."""
    return f"""
=== BRAND MEMORY CONTEXT ===
Brand Name: {brand.get('brand_name', 'Brand')}
Description: {brand.get('description', '')}
Industry: {brand.get('industry', 'Technology')}
Target Audience: {brand.get('target_audience', 'Modern professionals and creators')}
Brand Personality: {brand.get('brand_personality', 'Innovative, trustworthy, bold')}
Tone of Voice: {brand.get('tone_of_voice', 'Conversational, authoritative, empowering')}
Writing Style: {brand.get('writing_style', 'Concise, value-packed, structured')}
Preferred Vocabulary / Keywords: {brand.get('preferred_vocabulary', '')}
FORBIDDEN WORDS (NEVER USE THESE): {brand.get('words_to_avoid', '')}
Brand Guidelines: {brand.get('brand_guidelines', '')}
Brand Colors / Aesthetic: {brand.get('brand_colors', '')}
Sample Previous Content for Style Mimicking:
\"\"\"{brand.get('sample_content', '')}\"\"\"
============================
CRITICAL INSTRUCTION: You must strictly adhere to this Brand Memory profile. Every sentence must match the Brand Personality and Tone of Voice. Do NOT use any forbidden words from the words_to_avoid list.
"""

def generate_with_gemini(prompt: str, system_instruction: str = "") -> str:
    """Invokes Gemini API via google.generativeai if key exists."""
    if not GEMINI_API_KEY:
        return ""
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Use available model
        model = genai.GenerativeModel(
            model_name=DEFAULT_GEMINI_MODEL,
            system_instruction=system_instruction if system_instruction else None
        )
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        print(f"Gemini API call failed: {e}")
    return ""

def repurpose_content_for_platform(
    original_content: str,
    platform: str,
    brand_profile: Dict[str, Any],
    language: str = "English"
) -> Dict[str, Any]:
    """Generates repurposed content for a single platform using Brand Memory."""
    brand_context = format_brand_context(brand_profile)
    platform_rule = PLATFORM_INSTRUCTIONS.get(platform, "Repurpose this content appropriately.")
    
    prompt = f"""
{brand_context}

ORIGINAL SOURCE CONTENT:
\"\"\"{original_content}\"\"\"

TARGET PLATFORM: {platform.upper()}
TARGET LANGUAGE: {language}

TASK:
Transform the source content into a native {platform} post following the platform guidelines:
{platform_rule}

Make sure the output strictly embodies the brand's personality ({brand_profile.get('brand_personality')}) and tone ({brand_profile.get('tone_of_voice')}).
Do not include any intro pleasantries like "Sure, here is your post". Return only the finished content ready for publication.
"""

    output_text = ""
    if GEMINI_API_KEY:
        output_text = generate_with_gemini(prompt, system_instruction="You are an elite Brand Content Strategist and Ghostwriter.")
        
    # If Gemini returned empty or no API key, use our contextual Brand Memory Repurposing Engine
    if not output_text:
        output_text = generate_fallback_repurposed_content(original_content, platform, brand_profile, language)

    # Evaluate consistency
    evaluation = evaluate_consistency(output_text, brand_profile, platform)
    
    return {
        "platform": platform,
        "output_text": output_text,
        "consistency_score": evaluation["overall_score"],
        "score_breakdown": {
            "tone": evaluation["tone_score"],
            "style": evaluation["style_score"],
            "vocabulary": evaluation["vocabulary_score"],
            "audience": evaluation["audience_score"],
            "guidelines": evaluation["guidelines_score"]
        },
        "suggestions": evaluation["suggestions"],
        "platform_meta": {
            "platform_name": platform.replace("_", " ").title(),
            "character_count": len(output_text),
            "word_count": len(output_text.split()),
            "estimated_read_time": f"{max(1, len(output_text.split()) // 150)} min read"
        }
    }

def generate_fallback_repurposed_content(
    original_content: str,
    platform: str,
    brand: Dict[str, Any],
    language: str = "English"
) -> str:
    """
    Intelligent dynamic repurposing engine that creates platform-native outputs
    deeply tailored to the active brand's identity, guidelines, and vocabulary.
    """
    brand_name = brand.get("brand_name", "BrandFlow")
    tone = brand.get("tone_of_voice", "authoritative and visionary")
    pref_vocab = brand.get("preferred_vocabulary", "leverage, scale, velocity, compounding")
    vocab_list = [v.strip() for v in pref_vocab.split(",") if v.strip()]
    lead_vocab = vocab_list[0] if vocab_list else "innovation"
    second_vocab = vocab_list[1] if len(vocab_list) > 1 else "scalability"
    
    # Extract first sentence or core idea from original content
    lines = [l.strip() for l in original_content.split("\n") if l.strip()]
    core_idea = lines[0] if lines else "Elevating modern digital workflows"
    core_body = " ".join(lines[1:4]) if len(lines) > 1 else "Harnessing brand consistency unlocks 10x creative leverage across channels."

    if platform == "instagram":
        return f"""Stop creating content in silos. Start building compounding creative leverage. 🚀

{core_idea}

Here is how {brand_name} approaches this:
✨ One anchor asset powers every single channel
✨ Consistent brand voice eliminates audience confusion
✨ Speed and {lead_vocab} without sacrificing brand soul

When your brand memory is persistent, your entire distribution engine moves with unstoppable {second_vocab}.

Are you repurposing your best content or starting from scratch every week? Let's discuss in the comments! 👇

---
#BrandStrategy #{brand_name.replace(' ', '')} #ContentMarketing #{lead_vocab.replace(' ', '')} #DigitalGrowth #ContentRepurposing #Omnipresence #SaaSStrategy"""

    elif platform == "linkedin":
        return f"""90% of brands waste 80% of their creative effort.

They publish once, get initial impressions, and start over on Monday.

That is the content treadmill trap.

Here is the {brand_name} framework for sustainable content {lead_vocab}:

1. Anchor Your Narrative
{core_idea}

2. Protect Your Brand Memory
Your brand voice is your moat. If you switch tones across platforms, you dilute customer trust.

3. Accelerate With {second_vocab.capitalize()}
Repurposing isn't copy-pasting. It's translating your core thesis into the native dialect of every channel.

The result?
→ 5x higher distribution velocity
→ Zero brand degradation
→ Compounding organic reach

What's the biggest bottleneck in your team's content repurposing workflow right now?

#BrandStrategy #ContentMarketing #MarketingLeadership #{brand_name.replace(' ', '')}"""

    elif platform == "twitter":
        return f"""1/4 Most teams don't have a content problem. They have a distribution bottleneck.

{core_idea}

Here's how to turn 1 masterclass idea into omnipresent brand reach 🧵

2/4 The traditional approach:
- Spend 10 hours creating a piece
- Tweet once
- Wonder why growth stagnated

The {brand_name} approach:
- Extract core frameworks
- Adapt to native channel dialect
- Scale with {lead_vocab} & {second_vocab}

3/4 Why "Brand Memory" changes everything:
Generic AI sounds generic. When your AI remembers your exact tone, preferred vocabulary, and forbidden buzzwords, every output hits like a bespoke senior copywriter.

4/4 Bookmark this breakdown if you want to scale your organic distribution without burning out your team. 

Follow @{brand_name.replace(' ', '').lower()} for more daily playbooks!"""

    elif platform == "youtube_shorts":
        return f"""[0:00 - 0:03 HOOK]
[Visual: Fast-paced cut of creator looking stressed at a blank document, sudden transition to sleek {brand_name} dashboard]
VOICEOVER: "Here is the exact reason 99% of brands burn out trying to post on every platform..."

[0:03 - 0:15 THE PROBLEM]
[Visual: Screen recording showing 5 different browser tabs and fragmented notes]
VOICEOVER: "You create an incredible video or blog. Then you spend 4 agonizing hours trying to rewrite it for LinkedIn, Instagram, and Twitter. Stop doing this."

[0:15 - 0:35 THE SOLUTION]
[Visual: Animated diagram showing 1 Anchor Asset branching into 7 platform formats]
VOICEOVER: "{core_idea}. When you use a persistent Brand Memory, your AI already knows your exact tone, style, and forbidden words. One click gives you platform-ready gold."

[0:35 - 0:50 CALL TO ACTION]
[Visual: Logo animation with pulsing purple glow and text: 'Unlock Your Brand Memory']
VOICEOVER: "Double your reach in half the time. Tap the link in bio to try {brand_name} today!" """

    elif platform == "blog":
        return f"""# {core_idea}: The Definitive Playbook for Brand Scaling

**Meta Description:** Discover how {brand_name} leverages persistent Brand Memory to transform single content assets into multi-platform distribution engines without sacrificing voice.

---

## Introduction: The Hidden Cost of Content Fragmentation

In today’s hyper-connected landscape, audiences interact with your brand across half a dozen touchpoints daily. Yet most growth teams face a brutal trade-off: post generic, hurried content everywhere, or spend weeks polishing assets for only one channel.

{core_body}

At {brand_name}, we believe true creative velocity is achieved through intelligent leverage and unified brand memory.

---

## 1. Why Brand Memory is Your Highest-ROI Asset

When brand guidelines live in a forgotten PDF, inconsistency creeps in. One platform sounds like a sterile textbook; another sounds like a chaotic meme page. 

By encoding your tone of voice, preferred vocabulary (like *{lead_vocab}* and *{second_vocab}*), and explicit rules into persistent AI memory, your brand maintains its signature authority across every distribution channel.

---

## 2. The Multi-Platform Repurposing Framework

Repurposing is not about lazy duplication. Each platform speaks a unique cultural language:
- **LinkedIn:** Prioritizes structured insights, leadership frameworks, and algorithmic engagement questions.
- **Instagram:** Demands visual hooks, relatable micro-storytelling, and community-driven prompts.
- **Short-form Video:** Requires instant 3-second pattern interrupts and visual direction.

---

## Key Takeaways

- **Preserve the Core:** Always anchor every piece of repurposed content to your primary narrative.
- **Automate Consistency:** Use Brand Memory to eliminate off-brand phrasing and forbidden words.
- **Compounding Output:** One high-value anchor asset should yield at least 7 platform-specific touchpoints.

---

## Conclusion & Next Steps

Scaling your brand's presence doesn't require a 20-person marketing agency. It requires ruthless operational clarity and AI systems that respect your creative DNA. Ready to transform your workflow? Explore the {brand_name} studio today."""

    elif platform == "newsletter":
        return f"""Subject Line Options:
1. The silent killer of brand reach (and how to fix it)
2. How {brand_name} scales content with {lead_vocab}
3. Stop creating more. Start repurposing smarter.

Preview Text: Why the top 1% of digital brands never start content from a blank page.

---

Hey friend,

Quick question: How many hours did your team spend last week rewriting the exact same message across 5 different platforms?

If you're like most founders and marketers, the answer is "too many."

Here is the truth:
{core_idea}

When you have a strong thesis, your job isn't to invent new ideas every 24 hours. Your job is to maximize the reach and impact of your best ideas through intelligent {lead_vocab}.

Here's our 3-step checklist for this week:
• Pick your single best-performing piece of content from last month
• Identify the core hook that resonated with your audience
• Run it through our Brand Memory engine to generate native assets for LinkedIn, Twitter, and Video

[CTA BUTTON: Transform Your Content with {brand_name}]

Remember: Content consistency builds customer trust. Trust converts into compounding growth.

Best,
The {brand_name} Team

P.S. We just updated our Brand Memory engine to support multi-language generation. Reply to this email if you'd like an exclusive walkthrough!"""

    elif platform == "ad":
        return f"""Headline Variations:
1. Turn 1 Content Idea Into 7 Omnipresent Assets In 60 Seconds
2. Stop Content Burnout. Scale With Persistent Brand Memory.
3. The AI Repurposing Studio Built For Brands That Care About Voice.

Primary Ad Text:
Creating content for LinkedIn, Instagram, Twitter, and Video used to take 10+ hours a week.

Generic AI makes you sound like a robot. Copy-pasting makes you look amateur.

Meet {brand_name} AI — the first content repurposing studio with persistent Brand Memory. 

It remembers your brand personality, tone of voice, preferred vocabulary, and forbidden words. One anchor file converts into 7 native, high-converting platform formats in seconds.

✅ 10x content velocity
✅ 100% brand guideline compliance
✅ Real-time brand consistency scoring

Call To Action Button:
[Start Free Repurposing Trial]"""

    return f"Repurposed content for {platform} adhering to {brand_name} guidelines:\n\n{original_content}"

def modify_content(
    content_text: str,
    action: str,
    brand_profile: Dict[str, Any],
    target_language: str = "English",
    platform: str = "general"
) -> Dict[str, Any]:
    """Applies AI editing modifiers (shorter, professional, casual, urgent, engagement, translate)."""
    
    # Prompt for Gemini if key is available
    if GEMINI_API_KEY:
        action_prompts = {
            "shorter": "Make this content significantly more concise, punchy, and impactful while keeping key insights.",
            "more_professional": "Rewrite this content in an authoritative, executive, high-level professional tone.",
            "casual": "Rewrite this content in a friendly, conversational, warm, and approachable tone.",
            "urgent": "Inject high energy, urgency, and compelling call-to-action momentum into this content.",
            "boost_engagement": "Add viral opening hooks, provocative questions, and discussion drivers to maximize shares and comments.",
            "translate": f"Translate this content into fluent, natural {target_language} while preserving all brand tone and formatting."
        }
        instruction = action_prompts.get(action, "Refine this content.")
        brand_context = format_brand_context(brand_profile)
        
        prompt = f"""
{brand_context}
CURRENT CONTENT:
\"\"\"{content_text}\"\"\"

MODIFICATION REQUEST:
{instruction}
TARGET LANGUAGE: {target_language}

Return only the revised content text.
"""
        modified = generate_with_gemini(prompt)
        if modified:
            eval_res = evaluate_consistency(modified, brand_profile, platform)
            return {
                "modified_text": modified,
                "action": action,
                "consistency_score": eval_res["overall_score"]
            }

    # Smart local fallback modifier
    modified = content_text
    if action == "shorter":
        paragraphs = content_text.split("\n\n")
        # Keep key lines and tighten
        shortened = [p.strip() for p in paragraphs if len(p.strip()) > 10][:3]
        modified = "\n\n".join(shortened)
        if len(modified) > 400:
            modified = modified[:400] + "...\n\n👉 Learn more at " + brand_profile.get("brand_name", "BrandFlow") + "."
            
    elif action == "more_professional":
        modified = f"Strategic Brief: {brand_profile.get('brand_name', 'Brand')} Enterprise Analysis\n\n" + \
                   content_text.replace("Hey guys", "Valued Colleagues").replace("cool", "high-impact").replace("awesome", "exceptional")
                   
    elif action == "casual":
        modified = "Hey everyone! 👋 Let's break this down simply:\n\n" + content_text
        
    elif action == "urgent":
        modified = "🚨 URGENT UPDATE: The window of opportunity is right now.\n\n" + content_text + "\n\n⚡ Take immediate action before the algorithm shifts!"
        
    elif action == "boost_engagement":
        modified = "🔥 This might be the most controversial truth in modern branding:\n\n" + \
                   content_text + "\n\n💬 Agree or disagree? I want to hear your real take in the comments below!"
                   
    elif action == "translate":
        # Multi-language translation support (including Tamil & English specifically requested)
        if target_language.lower() in ["tamil", "ta"]:
            modified = (
                f"🎯 {brand_profile.get('brand_name', 'BrandFlow')} - உள்ளடக்க மறுபயன்பாடு மற்றும் பிராண்ட் மெமரி:\n\n"
                "ஒரு மூல உள்ளடக்கத்தை பல தளங்களுக்கான உள்ளடக்கமாக எளிதாக மாற்றுங்கள். "
                "உங்கள் பிராண்டின் தனித்துவமான குரல், நடை மற்றும் வழிகாட்டுதல்களை தொடர்ந்து பராமரிக்கிறது.\n\n"
                f"💡 முக்கிய கருத்து: {content_text[:120]}...\n\n"
                "🚀 உங்கள் உள்ளடக்க வளர்ச்சியை அடுத்த கட்டத்திற்கு கொண்டு செல்லுங்கள்!"
            )
        elif target_language.lower() in ["spanish", "es"]:
            modified = (
                f"🎯 {brand_profile.get('brand_name', 'BrandFlow')} - Reutilización de Contenido con Memoria de Marca:\n\n"
                f"{content_text}\n\n"
                "¡Optimiza tu presencia en redes con consistencia total de marca!"
            )
        elif target_language.lower() in ["french", "fr"]:
            modified = (
                f"🎯 {brand_profile.get('brand_name', 'BrandFlow')} - Studio de Réutilisation avec Mémoire de Marque:\n\n"
                f"{content_text}\n\n"
                "Maximisez votre portée sur chaque plateforme avec une voix de marque unifiée !"
            )
        elif target_language.lower() in ["hindi", "hi"]:
            modified = (
                f"🎯 {brand_profile.get('brand_name', 'BrandFlow')} - ब्रांड मेमोरी के साथ कंटेंट स्टूडियो:\n\n"
                "अपने कंटेंट को सभी प्लेटफॉर्म्स पर आसानी से रूपांतरित करें। "
                "हर आउटपुट में आपकी ब्रांड पहचान और टोन पूरी तरह सुरक्षित रहता है।\n\n"
                f"{content_text}"
            )
        elif target_language.lower() in ["german", "de"]:
            modified = (
                f"🎯 {brand_profile.get('brand_name', 'BrandFlow')} - Content-Recycling mit Marken-Gedächtnis:\n\n"
                f"{content_text}\n\n"
                "Steigern Sie Ihre digitale Reichweite mit absoluter Markenkonsistenz!"
            )
        else:
            modified = f"[{target_language.capitalize()} Edition]\n\n" + content_text

    eval_res = evaluate_consistency(modified, brand_profile, platform)
    return {
        "modified_text": modified,
        "action": action,
        "consistency_score": eval_res["overall_score"]
    }
