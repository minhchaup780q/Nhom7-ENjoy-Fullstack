package com.example.learningservice.services.impl;

import com.example.learningservice.dto.MistakeCreateRequest;
import com.example.learningservice.dto.MistakeResponse;
import com.example.learningservice.dto.MistakeStatsResponse;
import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.SessionItem;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.SessionItemRepository;
import com.example.learningservice.services.MistakeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MistakeServiceImpl implements MistakeService {

    private final MistakeRepository mistakeRepository;
    private final SessionItemRepository sessionItemRepository;

    @Override
    @Transactional
    public MistakeResponse recordMistake(Long userId, MistakeCreateRequest request) {
        Long targetUserId = (userId != null) ? userId : request.getUserId();
        if (targetUserId == null) {
            throw new IllegalArgumentException("User ID is required to log mistake.");
        }

        SessionItem question = sessionItemRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + request.getQuestionId()));

        // Kiểm tra xem user đã từng làm sai câu này ở vòng này chưa
        Optional<Mistake> existingMistakeOpt = mistakeRepository
                .findByUserIdAndQuestionIdAndRoundType(targetUserId, request.getQuestionId(), request.getRoundType());

        Mistake mistake;
        if (existingMistakeOpt.isPresent()) {
            mistake = existingMistakeOpt.get();
            mistake.setWrongAnswerSubmitted(request.getWrongAnswerSubmitted());
            mistake.setDurationSeconds(request.getDurationSeconds());
            mistake.setStatus(MistakeStatus.NEEDS_REVIEW); // Reset trạng thái về cần ôn tập
            mistake.setCreatedAt(LocalDateTime.now());
            // Xóa cache AI cũ nếu đáp án sai khác đi
            mistake.setAiExplanationCache(null);
        } else {
            mistake = Mistake.builder()
                    .userId(targetUserId)
                    .question(question)
                    .roundType(request.getRoundType() != null ? request.getRoundType() : 1)
                    .wrongAnswerSubmitted(request.getWrongAnswerSubmitted())
                    .durationSeconds(request.getDurationSeconds())
                    .status(MistakeStatus.NEEDS_REVIEW)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        Mistake saved = mistakeRepository.save(mistake);
        return MistakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public List<MistakeResponse> recordBatchMistakes(Long userId, List<MistakeCreateRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        List<MistakeResponse> results = new ArrayList<>();
        for (MistakeCreateRequest req : requests) {
            results.add(recordMistake(userId, req));
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakeResponse> getUserMistakes(Long userId, MistakeStatus status) {
        List<Mistake> mistakes;
        if (status != null) {
            mistakes = mistakeRepository.findByUserIdAndStatus(userId, status);
        } else {
            mistakes = mistakeRepository.findByUserId(userId);
        }
        return mistakes.stream()
                .map(MistakeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MistakeResponse updateMistakeStatus(Long userId, Long mistakeId, MistakeStatus status) {
        Mistake mistake = mistakeRepository.findById(mistakeId)
                .orElseThrow(() -> new IllegalArgumentException("Mistake not found with ID: " + mistakeId));

        if (userId != null && !mistake.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this mistake.");
        }

        mistake.setStatus(status);
        Mistake saved = mistakeRepository.save(mistake);
        return MistakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public MistakeResponse updateAiExplanation(Long mistakeId, String explanation) {
        Mistake mistake = mistakeRepository.findById(mistakeId)
                .orElseThrow(() -> new IllegalArgumentException("Mistake not found with ID: " + mistakeId));

        mistake.setAiExplanationCache(explanation);
        Mistake saved = mistakeRepository.save(mistake);
        return MistakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MistakeStatsResponse getUserMistakeStats(Long userId) {
        long needsReview = mistakeRepository.countByUserIdAndStatus(userId, MistakeStatus.NEEDS_REVIEW);
        long reviewed = mistakeRepository.countByUserIdAndStatus(userId, MistakeStatus.REVIEWED);
        long mastered = mistakeRepository.countByUserIdAndStatus(userId, MistakeStatus.MASTERED);
        long total = needsReview + reviewed + mastered;

        return MistakeStatsResponse.builder()
                .totalMistakes(total)
                .needsReviewCount(needsReview)
                .reviewedCount(reviewed)
                .masteredCount(mastered)
                .build();
    }

    @Override
    @Transactional
    public void deleteMistake(Long mistakeId) {
        mistakeRepository.deleteById(mistakeId);
    }
}
