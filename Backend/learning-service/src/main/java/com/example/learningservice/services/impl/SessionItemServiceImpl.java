package com.example.learningservice.services.impl;

import com.example.learningservice.entities.SessionItem;
import com.example.learningservice.repositories.SessionItemRepository;
import com.example.learningservice.services.SessionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionItemServiceImpl implements SessionItemService {

    private final SessionItemRepository sessionItemRepository;

    @Override
    public List<SessionItem> getAllActiveItems() {
        return sessionItemRepository.findByIsDeleteFalse();
    }

    @Override
    public SessionItem getItemById(Long id) {
        return sessionItemRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SessionItem hoặc đã bị xóa!"));
    }

    @Override
    public SessionItem createItem(SessionItem sessionItem) {
        sessionItem.setCreateAt(LocalDateTime.now());
        sessionItem.setIsDelete(false);
        return sessionItemRepository.save(sessionItem);
    }

    @Override
    public SessionItem updateItem(Long id, SessionItem sessionItemDetails) {
        SessionItem item = getItemById(id);
        item.setContentText(sessionItemDetails.getContentText());
        item.setTranslation(sessionItemDetails.getTranslation());
        item.setImageUrl(sessionItemDetails.getImageUrl());
        item.setAudioUrl(sessionItemDetails.getAudioUrl());
        item.setItemType(sessionItemDetails.getItemType());
        item.setUpdateAt(LocalDateTime.now());
        return sessionItemRepository.save(item);
    }

    @Override
    public void deleteItem(Long id) {
        SessionItem item = getItemById(id);
        item.setIsDelete(true);
        item.setUpdateAt(LocalDateTime.now());
        sessionItemRepository.save(item);
    }
}
