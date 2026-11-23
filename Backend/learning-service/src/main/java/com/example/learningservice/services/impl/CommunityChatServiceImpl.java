package com.example.learningservice.services.impl;

import com.example.learningservice.dto.CommunityChatMessageDto;
import com.example.learningservice.dto.CommunityChatPageResponseDto;
import com.example.learningservice.entities.CommunityChatMessage;
import com.example.learningservice.repositories.CommunityChatMessageRepository;
import com.example.learningservice.services.CommunityChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityChatServiceImpl implements CommunityChatService {

    private static final ZoneId ZONE_VN = ZoneId.of("Asia/Ho_Chi_Minh");

    private final CommunityChatMessageRepository communityChatMessageRepository;

    private LocalDateTime nowVn() {
        return LocalDateTime.now(ZONE_VN);
    }

    @Override
    @Transactional(readOnly = true)
    public CommunityChatPageResponseDto getRecentMessages(Long beforeId, int limit) {
        int pageSize = limit > 0 ? Math.min(limit, 50) : 30; // Mặc định 30 tin nhắn, tối đa 50 tin

        List<CommunityChatMessage> rawMessages;
        if (beforeId == null || beforeId <= 0) {
            // Lấy 30 tin nhắn mới nhất
            rawMessages = communityChatMessageRepository.findTop30ByIsDeleteFalseOrderByIdDesc();
        } else {
            // Lấy 30 tin nhắn cũ hơn beforeId
            rawMessages = communityChatMessageRepository.findByIdLessThanAndIsDeleteFalseOrderByIdDesc(
                    beforeId, PageRequest.of(0, pageSize)
            );
        }

        if (rawMessages == null || rawMessages.isEmpty()) {
            return CommunityChatPageResponseDto.builder()
                    .messages(Collections.emptyList())
                    .hasMore(false)
                    .oldestId(null)
                    .totalReturned(0)
                    .build();
        }

        // Tìm tin nhắn cũ nhất trong lô này để phục vụ lượt kéo trang tiếp theo
        Long oldestId = rawMessages.get(rawMessages.size() - 1).getId();
        boolean hasMore = communityChatMessageRepository.existsByIdLessThanAndIsDeleteFalse(oldestId);

        // Đảo ngược danh sách để trả về thứ tự thời gian tăng dần (cũ ở trên, mới ở dưới)
        List<CommunityChatMessage> chronologicalMessages = new ArrayList<>(rawMessages);
        Collections.reverse(chronologicalMessages);

        List<CommunityChatMessageDto> dtos = chronologicalMessages.stream()
                .map(msg -> CommunityChatMessageDto.builder()
                        .id(msg.getId())
                        .userId(msg.getUserId())
                        .username(msg.getUsername())
                        .avatarUrl(msg.getAvatarUrl())
                        .content(msg.getContent())
                        .messageType(msg.getMessageType())
                        .createdAt(msg.getCreateAt())
                        .build())
                .collect(Collectors.toList());

        return CommunityChatPageResponseDto.builder()
                .messages(dtos)
                .hasMore(hasMore)
                .oldestId(oldestId)
                .totalReturned(dtos.size())
                .build();
    }

    @Override
    @Transactional
    public CommunityChatMessage saveMessage(CommunityChatMessageDto dto) {
        if (dto == null || dto.getUserId() == null || dto.getContent() == null || dto.getContent().isBlank()) {
            log.warn("Bỏ qua tin nhắn không hợp lệ: {}", dto);
            return null;
        }

        LocalDateTime timestamp = dto.getCreatedAt() != null ? dto.getCreatedAt() : nowVn();

        CommunityChatMessage entity = CommunityChatMessage.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername() != null && !dto.getUsername().isBlank() ? dto.getUsername() : "Người dùng #" + dto.getUserId())
                .avatarUrl(dto.getAvatarUrl())
                .content(dto.getContent().trim())
                .messageType(dto.getMessageType() != null ? dto.getMessageType() : "TEXT")
                .build();

        entity.setCreateAt(timestamp);
        entity.setUpdateAt(timestamp);
        entity.setIsDelete(false);

        CommunityChatMessage saved = communityChatMessageRepository.save(entity);
        log.info("[Chat Persistence] Đã lưu tin nhắn ID #{} từ User #{} ({}) vào MariaDB",
                saved.getId(), saved.getUserId(), saved.getUsername());
        return saved;
    }
}
