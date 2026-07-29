package com.example.learningservice.controllers;

import com.example.learningservice.entities.Session;
import com.example.learningservice.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/by-part/{partId}")
    public ResponseEntity<List<Session>> getSessionsByPart(@PathVariable Long partId) {
        return ResponseEntity.ok(sessionService.getSessionsByPart(partId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PostMapping("/by-part/{partId}")
    public ResponseEntity<Session> createSession(@PathVariable Long partId, @RequestBody Session session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.createSession(partId, session));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session sessionDetails) {
        return ResponseEntity.ok(sessionService.updateSession(id, sessionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}
