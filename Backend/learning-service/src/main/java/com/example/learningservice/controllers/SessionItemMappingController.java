package com.example.learningservice.controllers;

import com.example.learningservice.entities.SessionItemMapping;
import com.example.learningservice.services.SessionItemMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionItemMappingController {

    private final SessionItemMappingService sessionItemMappingService;

    @PostMapping("/{sessionId}/items/{itemId}")
    public ResponseEntity<SessionItemMapping> addSessionItemToSession(
            @PathVariable Long sessionId,
            @PathVariable Long itemId,
            @RequestParam(required = false) Integer orderIndex) {
        
        SessionItemMapping mapping = sessionItemMappingService.addSessionItemToSession(sessionId, itemId, orderIndex);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapping);
    }

    @DeleteMapping("/{sessionId}/items/{itemId}")
    public ResponseEntity<Void> removeSessionItemFromSession(
            @PathVariable Long sessionId,
            @PathVariable Long itemId) {
        
        sessionItemMappingService.removeSessionItemFromSession(sessionId, itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{sessionId}/items")
    public ResponseEntity<List<SessionItemMapping>> getMappingsForSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionItemMappingService.getMappingsForSession(sessionId));
    }
}
