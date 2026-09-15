import re
import tempfile
import os
from difflib import SequenceMatcher
from typing import List, Dict, Any, Optional, Set
from app.core.whisper_model import WhisperModelSingleton
from app.schemas.assessment import AssessmentResponse, WordDetail

# Cấu hình dung sai mặc định (có thể tinh chỉnh qua biến môi trường)
KEYWORD_SIMILARITY_THRESHOLD = float(os.getenv("KEYWORD_SIMILARITY_THRESHOLD", "0.80"))  # 80% cho từ khóa chính
NORMAL_SIMILARITY_THRESHOLD = float(os.getenv("NORMAL_SIMILARITY_THRESHOLD", "0.75"))    # 75% cho các từ phụ

def calculate_word_similarity(w1: str, w2: str) -> float:
    """Đo độ tương đồng giữa 2 từ đơn lẻ (0.0 đến 1.0)."""
    if w1 == w2:
        return 1.0
    return SequenceMatcher(None, w1, w2).ratio()

def fuzzy_align_words(
    target_words: List[str],
    recognized_words: List[str],
    keyword_indices: Set[int]
) -> Set[int]:
    """
    Sử dụng quy hoạch động (LCS biến thể mờ) để tìm tập các vị trí từ mẫu
    mà người học đã phát âm đạt ngưỡng dung sai theo đúng thứ tự câu.
    """
    n, m = len(target_words), len(recognized_words)
    if n == 0 or m == 0:
        return set()

    # dp[i][j]: Số từ mẫu tối đa đã được khớp đạt chuẩn
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        tw = target_words[i - 1]
        threshold = KEYWORD_SIMILARITY_THRESHOLD if (i - 1) in keyword_indices else NORMAL_SIMILARITY_THRESHOLD
        for j in range(1, m + 1):
            rw = recognized_words[j - 1]
            sim = calculate_word_similarity(tw, rw)
            if sim >= threshold:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Truy vết ngược để xác định chính xác từ nào trong target_words đã đúng
    matched_target_indices: Set[int] = set()
    i, j = n, m
    while i > 0 and j > 0:
        tw = target_words[i - 1]
        rw = recognized_words[j - 1]
        threshold = KEYWORD_SIMILARITY_THRESHOLD if (i - 1) in keyword_indices else NORMAL_SIMILARITY_THRESHOLD
        if calculate_word_similarity(tw, rw) >= threshold and dp[i][j] == dp[i - 1][j - 1] + 1:
            matched_target_indices.add(i - 1)
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    return matched_target_indices


class SpeechService:
    @staticmethod
    def evaluate_pronunciation(
        audio_bytes: bytes,
        target_sentence: str,
        keyword: Optional[str] = None,
        file_extension: str = ".webm"
    ) -> AssessmentResponse:
        # 1. Lưu file audio tạm thời lên đĩa để faster_whisper đọc
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_audio:
            temp_audio.write(audio_bytes)
            temp_path = temp_audio.name

        try:
            # 2. Lấy singleton model và transcribe kèm initial_prompt để tăng độ nhạy ngữ cảnh
            model = WhisperModelSingleton.get_instance()
            prompt = f"English pronunciation practice: {target_sentence}"
            segments, info = model.transcribe(
                temp_path,
                word_timestamps=True,
                language="en",
                initial_prompt=prompt
            )

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

            # 5. Xác định vị trí từ khóa chính (nếu có)
            keyword_indices: Set[int] = set()
            if keyword and keyword.strip():
                clean_kw = re.sub(r"[^\w\s]", "", keyword.strip().lower())
                kw_parts = set(clean_kw.split())
                for idx, tw in enumerate(target_words_clean):
                    if tw in kw_parts or clean_kw in tw:
                        keyword_indices.add(idx)

            # 6. So sánh bằng thuật toán dung sai mờ (Fuzzy Alignment)
            # Keyword yêu cầu >= 80%, từ phụ yêu cầu >= 75%
            matched_indices = fuzzy_align_words(target_words_clean, recognized_words, keyword_indices)

            # 7. Tạo danh sách chi tiết từng từ
            details: List[WordDetail] = []
            for idx, raw_word in enumerate(target_words_raw):
                status = "correct" if idx in matched_indices else "wrong"
                details.append(WordDetail(word=raw_word, status=status))

            # 8. Tính toán điểm: Ngưỡng câu 100% (bắt buộc tất cả các từ đều phải đạt chuẩn dung sai)
            correct_count = len(matched_indices)
            total_count = len(target_words_raw) if len(target_words_raw) > 0 else 1
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

