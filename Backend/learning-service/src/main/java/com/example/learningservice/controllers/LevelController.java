package com.example.learningservice.controllers;

import com.example.learningservice.entities.Level;
import com.example.learningservice.services.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final LevelService levelService;

    @GetMapping
    public ResponseEntity<List<Level>> getAllActiveLevels() {
        return ResponseEntity.ok(levelService.getAllActiveLevels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Level> getLevelById(@PathVariable Long id) {
        return ResponseEntity.ok(levelService.getLevelById(id));
    }

    @PostMapping
    public ResponseEntity<Level> createLevel(@RequestBody Level level) {
        return ResponseEntity.status(HttpStatus.CREATED).body(levelService.createLevel(level));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        levelService.deleteLevel(id);
        return ResponseEntity.noContent().build();
    }
}
