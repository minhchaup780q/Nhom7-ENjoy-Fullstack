package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Part;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.repositories.PartRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final PartRepository partRepository;

    @Override
    public List<Session> getSessionsByPart(Long partId) {
        return sessionRepository.findByPartIdAndIsDeleteFalseOrderByOrderIndexAsc(partId);
    }

    @Override
    public Session getSessionById(Long id) {
        return sessionRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Session hoặc đã bị xóa!"));
    }

    @Override
    public Session createSession(Long partId, Session session) {
        Part part = partRepository.findByIdAndIsDeleteFalse(partId)
                .orElseThrow(() -> new RuntimeException("Part không tồn tại hoặc đã bị xóa!"));

        session.setPart(part);
        if (session.getStatus() == null) {
            session.setStatus(SessionStatus.LOCK); // Mặc định bài học mới tạo sẽ bị Khóa
        }
        session.setCreateAt(LocalDateTime.now());
        session.setIsDelete(false);

        return sessionRepository.save(session);
    }

    @Override
    public Session updateSession(Long id, Session sessionDetails) {
        Session session = getSessionById(id);
        session.setTitle(sessionDetails.getTitle());
        session.setKeyword(sessionDetails.getKeyword());
        session.setDescription(sessionDetails.getDescription());
        session.setOrderIndex(sessionDetails.getOrderIndex());
        session.setSessionType(sessionDetails.getSessionType());
        session.setStatus(sessionDetails.getStatus());
        session.setBadgeId(sessionDetails.getBadgeId());
        session.setUpdateAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    @Override
    public void deleteSession(Long id) {
        Session session = getSessionById(id);
        session.setIsDelete(true);
        session.setUpdateAt(LocalDateTime.now());
        sessionRepository.save(session);
    }
}