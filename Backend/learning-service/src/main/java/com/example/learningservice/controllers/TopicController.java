package com.example.learningservice.controllers;

import com.example.learningservice.entities.Topic;
import com.example.learningservice.services.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/by-level/{levelId}")
    public ResponseEntity<List<Topic>> getTopicsByLevel(@PathVariable Long levelId) {
        return ResponseEntity.ok(topicService.getTopicsByLevel(levelId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.getTopicById(id));
    }

    @PostMapping("/by-level/{levelId}")
    public ResponseEntity<Topic> createTopic(@PathVariable Long levelId, @RequestBody Topic topic) {
        return ResponseEntity.status(HttpStatus.CREATED).body(topicService.createTopic(levelId, topic));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @RequestBody Topic topicDetails) {
        return ResponseEntity.ok(topicService.updateTopic(id, topicDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}
