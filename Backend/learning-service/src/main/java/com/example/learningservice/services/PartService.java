package com.example.learningservice.services;

import com.example.learningservice.entities.Part;
import java.util.List;

public interface PartService {
    List<Part> getPartsByTopic(Long topicId);
    Part getPartById(Long id);
    Part createPart(Long topicId, Part part);
    Part updatePart(Long id, Part partDetails);
    void deletePart(Long id);
}
