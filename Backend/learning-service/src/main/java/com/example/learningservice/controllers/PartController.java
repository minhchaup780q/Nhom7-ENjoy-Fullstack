package com.example.learningservice.controllers;

import com.example.learningservice.entities.Part;
import com.example.learningservice.services.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartController {

    private final PartService partService;

    @GetMapping("/by-topic/{topicId}")
    public ResponseEntity<List<Part>> getPartsByTopic(@PathVariable Long topicId) {
        return ResponseEntity.ok(partService.getPartsByTopic(topicId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Part> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(partService.getPartById(id));
    }

    @PostMapping("/by-topic/{topicId}")
    public ResponseEntity<Part> createPart(@PathVariable Long topicId, @RequestBody Part part) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partService.createPart(topicId, part));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Part> updatePart(@PathVariable Long id, @RequestBody Part partDetails) {
        return ResponseEntity.ok(partService.updatePart(id, partDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }
}
