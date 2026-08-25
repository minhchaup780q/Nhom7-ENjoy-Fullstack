package com.example.learningservice.controllers;

import com.example.learningservice.entities.SessionItem;
import com.example.learningservice.services.SessionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/session-items")
@RequiredArgsConstructor
public class SessionItemController {

    private final SessionItemService sessionItemService;

    @GetMapping
    public ResponseEntity<List<SessionItem>> getAllActiveItems() {
        return ResponseEntity.ok(sessionItemService.getAllActiveItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionItemService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<SessionItem> createItem(@RequestBody SessionItem sessionItem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionItemService.createItem(sessionItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionItem> updateItem(@PathVariable Long id, @RequestBody SessionItem sessionItemDetails) {
        return ResponseEntity.ok(sessionItemService.updateItem(id, sessionItemDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        sessionItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
