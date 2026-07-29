package com.example.learningservice.services;

import com.example.learningservice.entities.SessionItem;
import java.util.List;

public interface SessionItemService {
    List<SessionItem> getAllActiveItems();
    SessionItem getItemById(Long id);
    SessionItem createItem(SessionItem sessionItem);
    SessionItem updateItem(Long id, SessionItem sessionItemDetails);
    void deleteItem(Long id);
}
