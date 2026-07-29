package com.example.learningservice.services;

import com.example.learningservice.entities.SessionItemMapping;
import java.util.List;

public interface SessionItemMappingService {
    SessionItemMapping addSessionItemToSession(Long sessionId, Long itemId, Integer orderIndex);
    void removeSessionItemFromSession(Long sessionId, Long itemId);
    List<SessionItemMapping> getMappingsForSession(Long sessionId);
}
