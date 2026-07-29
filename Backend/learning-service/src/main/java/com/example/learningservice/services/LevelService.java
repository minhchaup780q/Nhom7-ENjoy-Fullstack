package com.example.learningservice.services;

import com.example.learningservice.entities.Level;

import java.util.List;

public interface LevelService {
    List<Level> getAllActiveLevels();
    Level getLevelById(Long id);
    Level createLevel(Level level);
    void deleteLevel(Long id); // Soft delete
}