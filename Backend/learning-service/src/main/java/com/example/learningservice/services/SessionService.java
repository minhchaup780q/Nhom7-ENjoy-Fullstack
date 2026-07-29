package com.example.learningservice.services;

import com.example.learningservice.entities.Session;
import java.util.List;

public interface SessionService {
    List<Session> getSessionsByPart(Long partId);
    Session getSessionById(Long id);
    Session createSession(Long partId, Session session);
    Session updateSession(Long id, Session sessionDetails);
    void deleteSession(Long id);
}
