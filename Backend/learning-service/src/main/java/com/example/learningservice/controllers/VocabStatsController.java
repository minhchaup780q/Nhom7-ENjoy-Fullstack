package com.example.learningservice.controllers;

import com.example.learningservice.dto.CompleteWordRequest;
import com.example.learningservice.dto.SaveAiChallengeRequest;
import com.example.learningservice.dto.TopicWeakWordDetailDto;
import com.example.learningservice.dto.VocabAiChallengeDto;
import com.example.learningservice.dto.VocabStatsResponse;
import com.example.learningservice.services.VocabularyTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller thống kê và luyện tập từ vựng của user.
 */
@RestController
@RequestMapping("/api/vocab-stats")
@RequiredArgsConstructor
public class VocabStatsController {

    private final VocabularyTrackingService vocabularyTrackingService;

    /**
     * Lấy thống kê từ vựng của user theo từng topic.
     * GET /api/vocab-stats?userId={userId}
     */
    @GetMapping
    public ResponseEntity<VocabStatsResponse> getVocabStats(@RequestParam Long userId) {
        return ResponseEntity.ok(vocabularyTrackingService.getVocabStats(userId));
    }

    /**
     * Lấy danh sách từ yếu của topic kèm metadata chi tiết (ảnh, phát âm, nghĩa).
     * GET /api/vocab-stats/topic-words?userId={userId}&topic={topic}
     */
    @GetMapping("/topic-words")
    public ResponseEntity<List<TopicWeakWordDetailDto>> getTopicWeakWords(
            @RequestParam Long userId,
            @RequestParam String topic) {
        return ResponseEntity.ok(vocabularyTrackingService.getTopicWeakWords(userId, topic));
    }

    /**
     * Đánh dấu hoàn thành 1 từ vựng sau khi làm xong 4 vòng luyện tập.
     * PUT /api/vocab-stats/complete-word
     */
    @PutMapping("/complete-word")
    public ResponseEntity<Map<String, Object>> completeWord(@RequestBody CompleteWordRequest request) {
        boolean success = vocabularyTrackingService.completePracticeWord(
                request.getUserId(),
                request.getWord(),
                request.getTopic()
        );
        return ResponseEntity.ok(Map.of(
                "success", success,
                "word", request.getWord(),
                "message", success ? "Đã cập nhật trạng thái từ vựng sang CORRECT" : "Không tìm thấy từ vựng để cập nhật"
        ));
    }

    /**
     * Lấy câu hỏi ngữ pháp AI đã lưu trong DB (nếu force=false).
     * GET /api/vocab-stats/ai-challenge?userId={userId}&word={word}&force={force}
     */
    @GetMapping("/ai-challenge")
    public ResponseEntity<VocabAiChallengeDto> getAiChallenge(
            @RequestParam Long userId,
            @RequestParam String word,
            @RequestParam(defaultValue = "false") boolean force) {
        VocabAiChallengeDto challenge = vocabularyTrackingService.getAiChallenge(userId, word, force);
        return ResponseEntity.ok(challenge);
    }

    /**
     * Lưu câu hỏi ngữ pháp AI sinh ra vào DB để tái sử dụng.
     * POST /api/vocab-stats/ai-challenge
     */
    @PostMapping("/ai-challenge")
    public ResponseEntity<VocabAiChallengeDto> saveAiChallenge(@RequestBody SaveAiChallengeRequest request) {
        VocabAiChallengeDto saved = vocabularyTrackingService.saveAiChallenge(request);
        return ResponseEntity.ok(saved);
    }
}
