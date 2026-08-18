import re
import tempfile
import os
from difflib import SequenceMatcher
from typing import List, Dict, Any
from app.core.whisper_model import WhisperModelSingleton
from app.schemas.assessment import AssessmentResponse, WordDetail

class SpeechService:
    @staticmethod
    def evaluate_pronunciation(audio_bytes: bytes, target_sentence: str, file_extension: str = ".webm") -> AssessmentResponse:
        # 1. Lưu file audio tạm thời lên đĩa để faster_whisper đọc
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_audio:
            temp_audio.write(audio_bytes)
            temp_path = temp_audio.name

        try:
            # 2. Lấy singleton model và transcribe
            model = WhisperModelSingleton.get_instance()
            segments, info = model.transcribe(temp_path, word_timestamps=True, language="en")

            # 3. Thu thập các từ AI nghe được
            recognized_words: List[str] = []
            full_recognized_text_list: List[str] = []

            for segment in segments:
                if segment.words:
                    for word_info in segment.words:
                        raw_word = word_info.word.strip()
                        full_recognized_text_list.append(raw_word)
                        clean_word = re.sub(r"[^\w\s]", "", raw_word.lower())
                        if clean_word:
                            recognized_words.append(clean_word)

            recognized_text = " ".join(full_recognized_text_list)

            # 4. Chuẩn hóa từ mẫu (target_sentence)
            target_words_raw = target_sentence.split()
            target_words_clean = [re.sub(r"[^\w\s]", "", w.lower()) for w in target_words_raw]

            # 5. So sánh 2 danh sách từ bằng SequenceMatcher
            matcher = SequenceMatcher(None, target_words_clean, recognized_words)
            
            # Mặc định gán tất cả là "wrong"
            details: List[WordDetail] = [
                WordDetail(word=word, status="wrong") for word in target_words_raw
            ]

            # Cập nhật những từ khớp chính xác thành "correct"
            for block in matcher.get_matching_blocks():
                target_start_idx = block.a
                match_length = block.size
                for i in range(match_length):
                    if target_start_idx + i < len(details):
                        details[target_start_idx + i].status = "correct"

            # 6. Tính toán điểm phần trăm chính xác
            correct_count = sum(1 for d in details if d.status == "correct")
            total_count = len(details) if len(details) > 0 else 1
            accuracy_score = round((correct_count / total_count) * 100, 2)
            is_all_correct = (correct_count == total_count)

            return AssessmentResponse(
                isAllCorrect=is_all_correct,
                accuracyScore=accuracy_score,
                recognizedText=recognized_text,
                details=details
            )

        finally:
            # Xóa file audio tạm thời
            if os.path.exists(temp_path):
                os.remove(temp_path)
