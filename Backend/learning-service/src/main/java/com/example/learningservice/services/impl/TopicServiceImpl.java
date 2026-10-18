package com.example.learningservice.services.impl;

import com.example.learningservice.dto.TopicWithProgressDto;
import com.example.learningservice.entities.*;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.*;
import com.example.learningservice.services.TopicService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final LevelRepository levelRepository;
    private final PartRepository partRepository;
    private final SessionRepository sessionRepository;
    private final UserProgressRepository userProgressRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<Topic> getTopicsByLevel(Long levelId) {
        return topicRepository.findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(levelId);
    }

    @Override
    public Topic getTopicById(Long id) {
        return topicRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic hoặc đã bị xóa!"));
    }

    @Override
    public Topic createTopic(Long levelId, Topic topic) {
        Level level = levelRepository.findByIdAndIsDeleteFalse(levelId)
                .orElseThrow(() -> new RuntimeException("Level không tồn tại hoặc đã bị xóa!"));
        
        topic.setLevel(level);
        topic.setCreateAt(LocalDateTime.now());
        topic.setIsDelete(false);
        return topicRepository.save(topic);
    }

    @Override
    public Topic updateTopic(Long id, Topic topicDetails) {
        Topic topic = getTopicById(id);
        topic.setTitle(topicDetails.getTitle());
        topic.setDescription(topicDetails.getDescription());
        topic.setThumbnailUrl(topicDetails.getThumbnailUrl());
        topic.setOrderIndex(topicDetails.getOrderIndex());
        topic.setUpdateAt(LocalDateTime.now());
        return topicRepository.save(topic);
    }

    @Override
    public void deleteTopic(Long id) {
        Topic topic = getTopicById(id);
        topic.setIsDelete(true);
        topic.setUpdateAt(LocalDateTime.now());
        topicRepository.save(topic);
    }

    @Override
    public List<TopicWithProgressDto> getTopicsWithProgress(Long levelId, Long userId) {
        List<Topic> topics = topicRepository.findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(levelId);
        List<TopicWithProgressDto> result = new ArrayList<>();

        // Lấy toàn bộ UserProgress của user một lần (tránh N+1)
        List<UserProgress> allProgress = userProgressRepository.findByUserId(userId);
        Set<Long> skippedSessionIds = new HashSet<>();
        Set<Long> finishedSessionIds = new HashSet<>();
        for (UserProgress up : allProgress) {
            if (up.getSession() != null) {
                if (up.getStatus() == SessionStatus.SKIPPED) {
                    skippedSessionIds.add(up.getSession().getId());
                } else if (up.getStatus() == SessionStatus.FINISH) {
                    finishedSessionIds.add(up.getSession().getId());
                }
            }
        }

        for (Topic topic : topics) {
            List<Part> parts = partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topic.getId());
            if (parts.isEmpty()) continue;

            // Lấy tất cả sessions của topic
            List<Session> allSessions = new ArrayList<>();
            for (Part part : parts) {
                allSessions.addAll(sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(part.getId()));
            }

            // Phân loại sessions theo orderIndex
            boolean hasVocabSessions = false;    // orderIndex 1-5
            boolean hasGrammarSessions = false;  // orderIndex 6-10
            boolean allVocabSkipped = true;
            boolean allGrammarSkipped = true;
            int vocabCount = 0, grammarCount = 0;

            String grammarName = null;

            for (Session s : allSessions) {
                if (isVocabSession(s)) {
                    hasVocabSessions = true;
                    vocabCount++;
                    if (!skippedSessionIds.contains(s.getId())) {
                        allVocabSkipped = false;
                    }
                } else if (isGrammarSession(s)) {
                    hasGrammarSessions = true;
                    grammarCount++;
                    if (!skippedSessionIds.contains(s.getId())) {
                        allGrammarSkipped = false;
                    }
                    // Lấy grammar name từ session GRAMMAR hoặc session có orderIndex == 6 (vòng 6)
                    if (((s.getOrderIndex() != null && s.getOrderIndex() == 6) || s.getSessionType() == SessionType.GRAMMAR) && grammarName == null) {
                        grammarName = extractGrammarName(s);
                    }
                }
            }

            // Nếu không có session vocab thì coi như đã pass vocab
            if (!hasVocabSessions) allVocabSkipped = true;
            if (!hasGrammarSessions) allGrammarSkipped = true;

            // Tính learningStatus
            String learningStatus;
            if (allVocabSkipped && allGrammarSkipped) {
                learningStatus = "HIDDEN";
            } else if (allVocabSkipped) {
                learningStatus = "GRAMMAR_ONLY";
            } else if (allGrammarSkipped || !hasGrammarSessions) {
                learningStatus = "VOCAB_ONLY";
            } else {
                learningStatus = "FULL";
            }

            // Không trả về topic đã HIDDEN (ẩn luôn)
            if ("HIDDEN".equals(learningStatus)) continue;

            // Tính displayTitle
            String displayTitle;
            switch (learningStatus) {
                case "GRAMMAR_ONLY":
                    displayTitle = grammarName != null ? grammarName : topic.getTitle();
                    break;
                case "VOCAB_ONLY":
                    displayTitle = topic.getTitle();
                    break;
                default:
                    if (grammarName != null) {
                        displayTitle = topic.getTitle() + " • " + grammarName;
                    } else {
                        displayTitle = topic.getTitle();
                    }
                    break;
            }

            // Tính tiến trình hoàn thành dựa trên số bài học CHƯA ĐƯỢC SKIP
            int totalSessions = allSessions.size();
            int totalActiveSessions = 0;
            int completedSessions = 0;

            for (Session s : allSessions) {
                if (!skippedSessionIds.contains(s.getId())) {
                    totalActiveSessions++;
                    if (finishedSessionIds.contains(s.getId())) {
                        completedSessions++;
                    }
                }
            }

            int progressPercent = 0;
            if (totalActiveSessions == 0) {
                progressPercent = 100;
            } else {
                progressPercent = Math.min(100, Math.round(((float) completedSessions / totalActiveSessions) * 100.0f));
            }

            result.add(TopicWithProgressDto.builder()
                    .id(topic.getId())
                    .levelId(topic.getLevel() != null ? topic.getLevel().getId() : levelId)
                    .title(topic.getTitle())
                    .description(topic.getDescription())
                    .thumbnailUrl(topic.getThumbnailUrl())
                    .orderIndex(topic.getOrderIndex())
                    .grammarName(grammarName)
                    .learningStatus(learningStatus)
                    .displayTitle(displayTitle)
                    .totalSessions(totalSessions)
                    .totalActiveSessions(totalActiveSessions)
                    .completedSessions(completedSessions)
                    .progressPercent(progressPercent)
                    .build());
        }
        return result;
    }

    private String extractGrammarName(Session grammarSession) {
        if (grammarSession.getPayload() == null) return grammarSession.getTitle();
        try {
            JsonNode root = objectMapper.readTree(grammarSession.getPayload());
            JsonNode titleNode = root.get("title");
            if (titleNode != null && !titleNode.isNull()) {
                return titleNode.asText();
            }
        } catch (Exception e) {
            log.debug("Cannot parse grammar payload: {}", e.getMessage());
        }
        return grammarSession.getTitle();
    }

    private boolean isVocabSession(Session s) {
        if (s == null) return false;
        if (s.getOrderIndex() != null && s.getOrderIndex() >= 1 && s.getOrderIndex() <= 5) return true;
        SessionType type = s.getSessionType();
        return type == SessionType.FLASHCARD || type == SessionType.MATCH_WORD
                || type == SessionType.SPEAKING || type == SessionType.RE_ORDER || type == SessionType.DRAG_DROP;
    }

    private boolean isGrammarSession(Session s) {
        if (s == null) return false;
        if (s.getOrderIndex() != null && s.getOrderIndex() >= 6 && s.getOrderIndex() <= 10) return true;
        SessionType type = s.getSessionType();
        return type == SessionType.GRAMMAR || type == SessionType.FILL_IN_BLANK
                || type == SessionType.RE_ORDER_SENTENCE || type == SessionType.SPEAKING_SENTENCE || type == SessionType.CONVERSATION;
    }
}

