package com.example.learningservice.repositories;

import com.example.learningservice.entities.CommunityChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityChatMessageRepository extends JpaRepository<CommunityChatMessage, Long> {

    /**
     * Lấy danh sách 30 tin nhắn mới nhất (sắp xếp giảm dần theo ID để lấy mới nhất)
     */
    List<CommunityChatMessage> findTop30ByIsDeleteFalseOrderByIdDesc();

    /**
     * Phân trang tải tin nhắn cũ: Lấy danh sách tin nhắn có ID nhỏ hơn beforeId
     */
    List<CommunityChatMessage> findByIdLessThanAndIsDeleteFalseOrderByIdDesc(Long beforeId, Pageable pageable);

    /**
     * Kiểm tra xem còn tin nhắn nào cũ hơn beforeId không
     */
    boolean existsByIdLessThanAndIsDeleteFalse(Long beforeId);
}
