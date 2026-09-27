package com.example.learningservice.services.impl;

import com.example.learningservice.dto.MistakeCreateRequest;
import com.example.learningservice.dto.MistakeResponse;
import com.example.learningservice.dto.MistakeStatsResponse;
import com.example.learningservice.dto.PageResponse;
import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.Vocabulary;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.VocabularyRepository;
import com.example.learningservice.services.MistakeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final VocabularyRepository vocabularyRepository;

    @Override
    @Transactional
    public MistakeResponse recordMistake(Long userId, MistakeCreateRequest request) {
        Long targetUserId = (userId != null) ? userId : request.getUserId();
        if (targetUserId == null) {
            throw new IllegalArgumentException("User ID is required to log mistake.");
        }

        Vocabulary vocabulary = vocabularyRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Vocabulary not found with ID: " + request.getQuestionId()));

        // Kiểm tra xem user đã từng làm sai câu này ở vòng này chưa
        Optional<Mistake> existingMistakeOpt = mistakeRepository
                .findByUserIdAndVocabularyIdAndRoundType(targetUserId, request.getQuestionId(), request.getRoundType());

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
                    .vocabulary(vocabulary)
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
    @Transactional(readOnly = true)
    public PageResponse<MistakeResponse> getUserMistakesPaged(Long userId, MistakeStatus status, Integer roundType, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        
        Page<Mistake> mistakePage;
        if (status == MistakeStatus.NEEDS_REVIEW) {
            // Khi xem danh sách CẦN ÔN TẬP: Chỉ hiển thị các câu đến hạn ôn hôm nay (câu nào ôn rồi hôm nay sẽ ẩn đi)
            if (roundType != null) {
                mistakePage = mistakeRepository.findDueMistakesByUserIdAndRoundType(userId, roundType, todayStart, pageable);
            } else {
                mistakePage = mistakeRepository.findDueMistakesByUserId(userId, todayStart, pageable);
            }
        } else if (status != null && roundType != null) {
            mistakePage = mistakeRepository.findByUserIdAndStatusAndRoundType(userId, status, roundType, pageable);
        } else if (status != null) {
            mistakePage = mistakeRepository.findByUserIdAndStatus(userId, status, pageable);
        } else if (roundType != null) {
            mistakePage = mistakeRepository.findByUserIdAndRoundType(userId, roundType, pageable);
        } else {
            mistakePage = mistakeRepository.findByUserId(userId, pageable);
        }

        Page<MistakeResponse> responsePage = mistakePage.map(MistakeResponse::fromEntity);
        return PageResponse.fromPage(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakeResponse> getPracticeQueue(Long userId, Integer roundType, int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, limit), Sort.by(Sort.Direction.DESC, "createdAt"));
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Page<Mistake> mistakePage;
        if (roundType != null) {
            mistakePage = mistakeRepository.findDueMistakesByUserIdAndRoundType(userId, roundType, todayStart, pageable);
        } else {
            mistakePage = mistakeRepository.findDueMistakesByUserId(userId, todayStart, pageable);
        }
        return mistakePage.getContent().stream()
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
    @Transactional
    public MistakeResponse submitPracticeStep(Long userId, Long mistakeId, boolean isCorrect) {
        Mistake mistake = mistakeRepository.findById(mistakeId)
                .orElseThrow(() -> new IllegalArgumentException("Mistake not found with ID: " + mistakeId));

        if (userId != null && !mistake.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this mistake.");
        }

        LocalDate today = LocalDate.now();
        int currentStreak = mistake.getCorrectStreakDays() != null ? mistake.getCorrectStreakDays() : 0;

        if (isCorrect) {
            // Nếu currentStreak == 0: Luôn cho phép thăng cấp lên streak 1 (bắt đầu chu kỳ ôn tập)
            // Nếu currentStreak >= 1: Chỉ cho phép thăng cấp tiếp nếu lần ôn tập trước đó diễn ra vào ngày trước đó
            boolean canAdvance = (currentStreak == 0) || (mistake.getLastPracticedAt() == null || mistake.getLastPracticedAt().toLocalDate().isBefore(today));
            
            if (canAdvance) {
                int newStreak = Math.min(3, currentStreak + 1);
                mistake.setCorrectStreakDays(newStreak);
                mistake.setLastPracticedAt(LocalDateTime.now());
                mistake.setNextReviewAt(today.plusDays(1).atStartOfDay());

                if (newStreak >= 3) {
                    mistake.setMasteryScore(1.0);
                    mistake.setStatus(MistakeStatus.MASTERED);
                } else if (newStreak == 2) {
                    mistake.setMasteryScore(0.67);
                    mistake.setStatus(MistakeStatus.REVIEWED);
                } else {
                    mistake.setMasteryScore(0.33);
                    mistake.setStatus(MistakeStatus.REVIEWED);
                }
            } else {
                // Đã hoàn thành mục tiêu ngày hôm nay cho câu này, chỉ cập nhật timestamp
                mistake.setLastPracticedAt(LocalDateTime.now());
            }
        } else {
            // Làm sai -> reset về cần ôn tập từ đầu
            mistake.setStatus(MistakeStatus.NEEDS_REVIEW);
            mistake.setCorrectStreakDays(0);
            mistake.setMasteryScore(0.0);
            mistake.setNextReviewAt(null);
            mistake.setLastPracticedAt(null);
        }

        Mistake saved = mistakeRepository.save(mistake);
        return MistakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakeResponse> getRoadmapMistakes(Long userId) {
        List<Mistake> mistakes = mistakeRepository.findByUserId(userId);
        return mistakes.stream()
                .map(MistakeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MistakeStatsResponse getUserMistakeStats(Long userId) {
        List<Mistake> mistakes = mistakeRepository.findByUserId(userId);
        LocalDate today = LocalDate.now();

        long needsReview = 0;
        long reviewed = 0;
        long mastered = 0;
        long dueToday = 0;
        long waiting1Day = 0;
        long waiting2Days = 0;

        for (Mistake m : mistakes) {
            MistakeStatus st = m.getStatus() != null ? m.getStatus() : MistakeStatus.NEEDS_REVIEW;
            int streak = m.getCorrectStreakDays() != null ? m.getCorrectStreakDays() : 0;
            boolean isDueToday = (m.getLastPracticedAt() == null || m.getLastPracticedAt().toLocalDate().isBefore(today));

            if (st == MistakeStatus.MASTERED || streak >= 3) {
                mastered++;
            } else if (isDueToday) {
                dueToday++;
                needsReview++; // Số câu cần ôn tập hôm nay
            } else {
                reviewed++; // Đang trong lịch chờ ngày tiếp theo
                if (streak == 1) {
                    waiting1Day++;
                } else if (streak == 2) {
                    waiting2Days++;
                }
            }
        }

        return MistakeStatsResponse.builder()
                .totalMistakes(mistakes.size())
                .needsReviewCount(needsReview)
                .reviewedCount(reviewed)
                .masteredCount(mastered)
                .dueTodayCount(dueToday)
                .waiting1DayCount(waiting1Day)
                .waiting2DaysCount(waiting2Days)
                .build();
    }

    @Override
    @Transactional
    public void deleteMistake(Long mistakeId) {
        mistakeRepository.deleteById(mistakeId);
    }
}
