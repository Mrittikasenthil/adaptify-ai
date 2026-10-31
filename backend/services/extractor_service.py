import io
from typing import Tuple, Dict, Any
from services.transcription_service import transcribe_media

def extract_content(file_bytes: bytes, filename: str, content_type: str) -> Tuple[str, str, Dict[str, Any]]:
    """
    Extracts text and metadata from uploaded files (text, pdf, audio, video).
    Returns (extracted_text, detected_type, metadata)
    """
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    metadata = {"filename": filename, "file_size": len(file_bytes)}
    
    # 1. Plain text / Markdown
    if ext in ["txt", "md", "csv", "json"] or "text" in content_type:
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = file_bytes.decode("latin-1", errors="replace")
        metadata["type"] = "text"
        return text.strip(), "text", metadata
        
    # 2. PDF extraction using pypdf
    if ext == "pdf" or "pdf" in content_type:
        try:
            import pypdf
            pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(pdf_reader.pages):
                extracted = page.extract_text()
                if extracted:
                    pages_text.append(extracted)
            
            full_text = "\n\n".join(pages_text).strip()
            if not full_text:
                full_text = "Note: PDF contained scanned or image-based pages. Please paste your text or upload a searchable text document."
            metadata["pages_count"] = len(pdf_reader.pages)
            metadata["type"] = "pdf"
            return full_text, "pdf", metadata
        except Exception as e:
            return f"Error extracting PDF: {str(e)}", "pdf", {"error": str(e)}

    # 3. Audio & Video transcription
    audio_extensions = ["mp3", "wav", "m4a", "aac", "ogg", "flac"]
    video_extensions = ["mp4", "mov", "avi", "webm", "mkv"]
    
    if ext in audio_extensions or "audio" in content_type:
        text, trans_meta = transcribe_media(file_bytes, filename, content_type)
        metadata.update(trans_meta)
        metadata["type"] = "audio"
        return text, "audio", metadata

    if ext in video_extensions or "video" in content_type:
        text, trans_meta = transcribe_media(file_bytes, filename, content_type)
        metadata.update(trans_meta)
        metadata["type"] = "video"
        return text, "video", metadata

    # Default fallback
    try:
        text = file_bytes.decode("utf-8")
        return text.strip(), "unknown", metadata
    except Exception:
        return "Unsupported file format. Please upload a Text, PDF, Audio (MP3/WAV), or Video (MP4) file.", "unsupported", metadata
