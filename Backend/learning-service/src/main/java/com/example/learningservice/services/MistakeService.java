package com.example.learningservice.services;

import com.example.learningservice.dto.MistakeCreateRequest;
import com.example.learningservice.dto.MistakeResponse;
import com.example.learningservice.dto.MistakeStatsResponse;
import com.example.learningservice.dto.PageResponse;
import com.example.learningservice.entities.enums.MistakeStatus;

import java.util.List;

public interface MistakeService {

    MistakeResponse recordMistake(Long userId, MistakeCreateRequest request);

    List<MistakeResponse> recordBatchMistakes(Long userId, List<MistakeCreateRequest> requests);

    List<MistakeResponse> getUserMistakes(Long userId, MistakeStatus status);

    PageResponse<MistakeResponse> getUserMistakesPaged(Long userId, MistakeStatus status, Integer roundType, int page, int size);

    List<MistakeResponse> getPracticeQueue(Long userId, Integer roundType, int limit);

    MistakeResponse updateMistakeStatus(Long userId, Long mistakeId, MistakeStatus status);

    MistakeResponse updateAiExplanation(Long mistakeId, String explanation);

    MistakeStatsResponse getUserMistakeStats(Long userId);

    void deleteMistake(Long mistakeId);
}

