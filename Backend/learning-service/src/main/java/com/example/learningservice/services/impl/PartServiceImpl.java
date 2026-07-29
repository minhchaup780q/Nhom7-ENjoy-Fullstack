package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Part;
import com.example.learningservice.entities.Topic;
import com.example.learningservice.repositories.PartRepository;
import com.example.learningservice.repositories.TopicRepository;
import com.example.learningservice.services.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartServiceImpl implements PartService {

    private final PartRepository partRepository;
    private final TopicRepository topicRepository;

    @Override
    public List<Part> getPartsByTopic(Long topicId) {
        return partRepository.findByTopicIdAndIsDeleteFalseOrderByOrderIndexAsc(topicId);
    }

    @Override
    public Part getPartById(Long id) {
        return partRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Part hoặc đã bị xóa!"));
    }

    @Override
    public Part createPart(Long topicId, Part part) {
        Topic topic = topicRepository.findByIdAndIsDeleteFalse(topicId)
                .orElseThrow(() -> new RuntimeException("Topic không tồn tại hoặc đã bị xóa!"));

        part.setTopic(topic);
        part.setCreateAt(LocalDateTime.now());
        part.setIsDelete(false);
        return partRepository.save(part);
    }

    @Override
    public Part updatePart(Long id, Part partDetails) {
        Part part = getPartById(id);
        part.setTitle(partDetails.getTitle());
        part.setOrderIndex(partDetails.getOrderIndex());
        part.setUpdateAt(LocalDateTime.now());
        return partRepository.save(part);
    }

    @Override
    public void deletePart(Long id) {
        Part part = getPartById(id);
        part.setIsDelete(true);
        part.setUpdateAt(LocalDateTime.now());
        partRepository.save(part);
    }
}
