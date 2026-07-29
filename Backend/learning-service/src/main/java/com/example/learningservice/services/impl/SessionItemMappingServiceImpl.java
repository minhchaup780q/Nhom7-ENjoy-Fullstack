package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.SessionItem;
import com.example.learningservice.entities.SessionItemMapping;
import com.example.learningservice.entities.SessionItemMappingId;
import com.example.learningservice.repositories.SessionItemMappingRepository;
import com.example.learningservice.repositories.SessionItemRepository;
import com.example.learningservice.repositories.SessionRepository;
import com.example.learningservice.services.SessionItemMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionItemMappingServiceImpl implements SessionItemMappingService {

    private final SessionItemMappingRepository sessionItemMappingRepository;
    private final SessionRepository sessionRepository;
    private final SessionItemRepository sessionItemRepository;

    @Override
    public SessionItemMapping addSessionItemToSession(Long sessionId, Long itemId, Integer orderIndex) {
        Session session = sessionRepository.findByIdAndIsDeleteFalse(sessionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Session hoặc đã bị xóa!"));
        
        SessionItem sessionItem = sessionItemRepository.findByIdAndIsDeleteFalse(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SessionItem hoặc đã bị xóa!"));

        SessionItemMappingId mappingId = new SessionItemMappingId(sessionId, itemId);
        
        // Kiểm tra nếu mapping đã tồn tại
        SessionItemMapping mapping = sessionItemMappingRepository.findById(mappingId)
                .orElse(null);

        if (mapping == null) {
            mapping = SessionItemMapping.builder()
                    .id(mappingId)
                    .session(session)
                    .sessionItem(sessionItem)
                    .orderIndex(orderIndex)
                    .build();
            mapping.setCreateAt(LocalDateTime.now());
            mapping.setIsDelete(false);
        } else {
            // Nếu đã tồn tại nhưng bị đánh dấu xóa, khôi phục lại và cập nhật orderIndex
            mapping.setIsDelete(false);
            mapping.setOrderIndex(orderIndex);
            mapping.setUpdateAt(LocalDateTime.now());
        }

        return sessionItemMappingRepository.save(mapping);
    }

    @Override
    public void removeSessionItemFromSession(Long sessionId, Long itemId) {
        SessionItemMappingId mappingId = new SessionItemMappingId(sessionId, itemId);
        SessionItemMapping mapping = sessionItemMappingRepository.findById(mappingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ánh xạ (mapping) giữa Session và SessionItem!"));
        
        // Thực hiện xóa cứng vì đây là bảng trung gian liên kết Many-to-Many
        sessionItemMappingRepository.delete(mapping);
    }

    @Override
    public List<SessionItemMapping> getMappingsForSession(Long sessionId) {
        // Kiểm tra xem Session có tồn tại không
        if (!sessionRepository.existsById(sessionId)) {
            throw new RuntimeException("Không tìm thấy Session!");
        }
        return sessionItemMappingRepository.findBySessionIdOrderByOrderIndexAsc(sessionId);
    }
}
