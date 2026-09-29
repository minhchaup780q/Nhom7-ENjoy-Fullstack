package com.example.learningservice.services.impl;

import com.example.learningservice.dto.MistakeCreateRequest;
import com.example.learningservice.dto.MistakeResponse;
import com.example.learningservice.dto.MistakeStatsResponse;
import com.example.learningservice.dto.PageResponse;
import com.example.learningservice.entities.Mistake;
import com.example.learningservice.entities.PartVocabulary;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.Vocabulary;
import com.example.learningservice.entities.enums.MistakeStatus;
import com.example.learningservice.repositories.MistakeRepository;
import com.example.learningservice.repositories.PartVocabularyRepository;
import com.example.learningservice.repositories.SessionRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MistakeServiceImpl implements MistakeService {

    private final MistakeRepository mistakeRepository;
    private final VocabularyRepository vocabularyRepository;
    private final PartVocabularyRepository partVocabularyRepository;
    private final com.example.learningservice.repositories.SessionRepository sessionRepository;
    private final com.example.learningservice.repositories.PersonalizedAiChallengeRepository personalizedAiChallengeRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private com.example.learningservice.entities.enums.SessionType mapRoundTypeToSessionType(Integer roundType) {
        if (roundType == null) return null;
        switch (roundType) {
            case 1: return com.example.learningservice.entities.enums.SessionType.FLASHCARD;
            case 2: return com.example.learningservice.entities.enums.SessionType.MATCH_WORD;
            case 3: return com.example.learningservice.entities.enums.SessionType.SPEAKING;
            case 4: return com.example.learningservice.entities.enums.SessionType.RE_ORDER;
            case 5: return com.example.learningservice.entities.enums.SessionType.DRAG_DROP;
            case 6: return com.example.learningservice.entities.enums.SessionType.GRAMMAR;
            case 7: return com.example.learningservice.entities.enums.SessionType.FILL_IN_BLANK;
            case 8: return com.example.learningservice.entities.enums.SessionType.RE_ORDER_SENTENCE;
            case 9: return com.example.learningservice.entities.enums.SessionType.SPEAKING_SENTENCE;
            case 10: return com.example.learningservice.entities.enums.SessionType.CONVERSATION;
            default: return null;
        }
    }

    private MistakeResponse enrichMistakeResponse(MistakeResponse response) {
        if (response == null || response.getQuestionId() == null) return response;
        try {
            List<PartVocabulary> pvList = partVocabularyRepository.findByVocabularyIdWithTopic(response.getQuestionId());
            if (pvList != null && !pvList.isEmpty()) {
                PartVocabulary pv = pvList.get(0);
                if (pv.getPart() != null) {
                    Long partId = pv.getPart().getId();
                    response.setPartId(partId);
                    if (pv.getPart().getTopic() != null) {
                        response.setKeyword(pv.getPart().getTopic().getTitle());
                    } else {
                        response.setKeyword(pv.getPart().getTitle());
                    }

                    if (response.getRoundType() != null) {
                        com.example.learningservice.entities.enums.SessionType sType = mapRoundTypeToSessionType(response.getRoundType());
                        if (sType != null) {
                            List<Session> sessions = sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);
                            for (Session s : sessions) {
                                if (s.getSessionType() == sType && s.getPayload() != null) {
                                    response.setSessionPayload(s.getPayload());
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error fetching topic for mistake vocabulary {}: {}", response.getQuestionId(), e.getMessage());
        }
        return response;
    }

    private List<MistakeResponse> enrichMistakeResponses(List<MistakeResponse> responses) {
        if (responses == null || responses.isEmpty()) return responses;
        List<Long> vocabIds = responses.stream()
                .map(MistakeResponse::getQuestionId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        if (vocabIds.isEmpty()) return responses;

        Map<Long, String> topicMap = new HashMap<>();
        Map<Long, Long> partMap = new HashMap<>();
        try {
            List<PartVocabulary> pvList = partVocabularyRepository.findByVocabularyIdsWithTopic(vocabIds);
            if (pvList != null) {
                for (PartVocabulary pv : pvList) {
                    if (pv.getVocabulary() != null && pv.getPart() != null) {
                        Long vId = pv.getVocabulary().getId();
                        partMap.putIfAbsent(vId, pv.getPart().getId());
                        String title = null;
                        if (pv.getPart().getTopic() != null) {
                            title = pv.getPart().getTopic().getTitle();
                        } else {
                            title = pv.getPart().getTitle();
                        }
                        if (title != null) {
                            topicMap.putIfAbsent(vId, title);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error fetching topic batch for mistakes: {}", e.getMessage());
        }

        Map<String, String> sessionPayloadMap = new HashMap<>();
        List<Long> partIds = partMap.values().stream().distinct().collect(Collectors.toList());
        if (!partIds.isEmpty()) {
            try {
                List<Session> sessions = sessionRepository.findByPartIdInAndIsDeleteFalse(partIds);
                for (Session s : sessions) {
                    if (s.getPart() != null && s.getSessionType() != null && s.getPayload() != null) {
                        String key = s.getPart().getId() + "_" + s.getSessionType().name();
                        sessionPayloadMap.put(key, s.getPayload());
                    }
                }
            } catch (Exception e) {
                log.warn("Error fetching sessions for mistakes: {}", e.getMessage());
            }
        }

        for (MistakeResponse r : responses) {
            if (r.getQuestionId() != null) {
                if (topicMap.containsKey(r.getQuestionId())) {
                    r.setKeyword(topicMap.get(r.getQuestionId()));
                }
                if (partMap.containsKey(r.getQuestionId())) {
                    Long pId = partMap.get(r.getQuestionId());
                    r.setPartId(pId);
                    if (r.getRoundType() != null) {
                        com.example.learningservice.entities.enums.SessionType sType = mapRoundTypeToSessionType(r.getRoundType());
                        if (sType != null) {
                            String key = pId + "_" + sType.name();
                            if (sessionPayloadMap.containsKey(key)) {
                                r.setSessionPayload(sessionPayloadMap.get(key));
                            }
                        }
                    }
                }
            }
        }
        return responses;
    }

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

        if (existingMistakeOpt.isPresent()) {
            Mistake existing = existingMistakeOpt.get();
            if (existing.getStatus() == MistakeStatus.MASTERED) {
                // Đã ôn xong (MASTERED), nhưng tự học sai lại -> reset về NEEDS_REVIEW
                existing.setWrongAnswerSubmitted(request.getWrongAnswerSubmitted());
                existing.setPhonemeErrorType(request.getPhonemeErrorType());
                existing.setRecognizedAudioTranscript(request.getRecognizedAudioTranscript());
                existing.setDurationSeconds(request.getDurationSeconds());
                existing.setStatus(MistakeStatus.NEEDS_REVIEW);
                existing.setCorrectStreakDays(0);
                existing.setMasteryScore(0.0);
                existing.setNextReviewAt(null);
                existing.setLastPracticedAt(null);
                existing.setCreatedAt(LocalDateTime.now());
                existing.setAiExplanationCache(null);
                Mistake saved = mistakeRepository.save(existing);
                return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
            } else {
                // Đang trong quá trình ôn tập (NEEDS_REVIEW hoặc REVIEWED) -> không cho ghi đè, cập nhật thông tin nhận diện mới nhất nếu có
                if (request.getPhonemeErrorType() != null) {
                    existing.setPhonemeErrorType(request.getPhonemeErrorType());
                }
                if (request.getRecognizedAudioTranscript() != null) {
                    existing.setRecognizedAudioTranscript(request.getRecognizedAudioTranscript());
                }
                Mistake saved = mistakeRepository.save(existing);
                return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
            }
        }

        Mistake mistake = Mistake.builder()
                .userId(targetUserId)
                .vocabulary(vocabulary)
                .roundType(request.getRoundType() != null ? request.getRoundType() : 1)
                .wrongAnswerSubmitted(request.getWrongAnswerSubmitted())
                .phonemeErrorType(request.getPhonemeErrorType())
                .recognizedAudioTranscript(request.getRecognizedAudioTranscript())
                .durationSeconds(request.getDurationSeconds())
                .status(MistakeStatus.NEEDS_REVIEW)
                .createdAt(LocalDateTime.now())
                .build();

        Mistake saved = mistakeRepository.save(mistake);
        return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
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
        List<MistakeResponse> list = mistakes.stream()
                .map(MistakeResponse::fromEntity)
                .collect(Collectors.toList());
        return enrichMistakeResponses(list);
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
        enrichMistakeResponses(responsePage.getContent());
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
        List<MistakeResponse> list = mistakePage.getContent().stream()
                .map(MistakeResponse::fromEntity)
                .collect(Collectors.toList());
        return enrichMistakeResponses(list);
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
        return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
    }

    @Override
    @Transactional
    public MistakeResponse updateAiExplanation(Long mistakeId, String explanation) {
        Mistake mistake = mistakeRepository.findById(mistakeId)
                .orElseThrow(() -> new IllegalArgumentException("Mistake not found with ID: " + mistakeId));

        mistake.setAiExplanationCache(explanation);
        Mistake saved = mistakeRepository.save(mistake);
        return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
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
                } else {
                    mistake.setMasteryScore(0.0);
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
        return enrichMistakeResponse(MistakeResponse.fromEntity(saved));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MistakeResponse> getRoadmapMistakes(Long userId) {
        List<Mistake> mistakes = mistakeRepository.findByUserId(userId);
        List<MistakeResponse> list = mistakes.stream()
                .map(MistakeResponse::fromEntity)
                .collect(Collectors.toList());
        return enrichMistakeResponses(list);
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

    @Override
    @Transactional(readOnly = true)
    public com.example.learningservice.dto.PersonalizedAiChallengeDTO getAiChallenge(Long userId, String skillKey, String topicId) {
        if (userId == null) userId = 1L;
        if (topicId == null) topicId = "all";
        Optional<com.example.learningservice.entities.PersonalizedAiChallenge> opt = 
            personalizedAiChallengeRepository.findByUserIdAndSkillKeyAndTopicId(userId, skillKey, topicId);
        
        if (opt.isEmpty()) return null;

        com.example.learningservice.entities.PersonalizedAiChallenge entity = opt.get();
        List<String> options = new ArrayList<>();
        if (entity.getOptionsJson() != null && !entity.getOptionsJson().isBlank()) {
            try {
                options = objectMapper.readValue(entity.getOptionsJson(), new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
            } catch (Exception e) {
                log.warn("Could not parse options json: {}", entity.getOptionsJson());
            }
        }

        return com.example.learningservice.dto.PersonalizedAiChallengeDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .skillKey(entity.getSkillKey())
                .topicId(entity.getTopicId())
                .topicName(entity.getTopicName())
                .title(entity.getTitle())
                .story(entity.getStory())
                .storyVi(entity.getStoryVi())
                .question(entity.getQuestion())
                .options(options)
                .correctAnswer(entity.getCorrectAnswer())
                .hint(entity.getHint())
                .build();
    }

    @Override
    @Transactional
    public com.example.learningservice.dto.PersonalizedAiChallengeDTO saveOrUpdateAiChallenge(Long userId, com.example.learningservice.dto.PersonalizedAiChallengeDTO dto) {
        final Long effectiveUserId = (userId != null) ? userId : 1L;
        final String effectiveTopicId = (dto.getTopicId() != null) ? dto.getTopicId() : "all";
        final String effectiveSkillKey = (dto.getSkillKey() != null) ? dto.getSkillKey() : "writing";

        Optional<com.example.learningservice.entities.PersonalizedAiChallenge> opt = 
            personalizedAiChallengeRepository.findByUserIdAndSkillKeyAndTopicId(effectiveUserId, effectiveSkillKey, effectiveTopicId);

        com.example.learningservice.entities.PersonalizedAiChallenge entity = opt.orElseGet(() -> 
            com.example.learningservice.entities.PersonalizedAiChallenge.builder()
                .userId(effectiveUserId)
                .skillKey(effectiveSkillKey)
                .topicId(effectiveTopicId)
                .build()
        );

        String optionsJson = "[]";
        if (dto.getOptions() != null) {
            try {
                optionsJson = objectMapper.writeValueAsString(dto.getOptions());
            } catch (Exception e) {
                log.warn("Error serializing options: {}", e.getMessage());
            }
        }

        entity.setTopicName(dto.getTopicName());
        entity.setTitle(dto.getTitle());
        entity.setStory(dto.getStory());
        entity.setStoryVi(dto.getStoryVi());
        entity.setQuestion(dto.getQuestion());
        entity.setOptionsJson(optionsJson);
        entity.setCorrectAnswer(dto.getCorrectAnswer());
        entity.setHint(dto.getHint());

        com.example.learningservice.entities.PersonalizedAiChallenge saved = personalizedAiChallengeRepository.save(entity);

        dto.setId(saved.getId());
        dto.setUserId(saved.getUserId());
        return dto;
    }
}

