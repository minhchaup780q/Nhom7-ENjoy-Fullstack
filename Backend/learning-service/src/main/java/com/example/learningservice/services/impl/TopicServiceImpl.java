package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Level;
import com.example.learningservice.entities.Topic;
import com.example.learningservice.repositories.LevelRepository;
import com.example.learningservice.repositories.TopicRepository;
import com.example.learningservice.services.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final LevelRepository levelRepository;

    @Override
    public List<Topic> getTopicsByLevel(Long levelId) {
        return topicRepository.findByLevelIdAndIsDeleteFalseOrderByOrderIndexAsc(levelId);
    }

    @Override
    public Topic getTopicById(Long id) {
        return topicRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Topic hoặc đã bị xóa!"));
    }

    @Override
    public Topic createTopic(Long levelId, Topic topic) {
        Level level = levelRepository.findByIdAndIsDeleteFalse(levelId)
                .orElseThrow(() -> new RuntimeException("Level không tồn tại hoặc đã bị xóa!"));
        
        topic.setLevel(level);
        topic.setCreateAt(LocalDateTime.now());
        topic.setIsDelete(false);
        return topicRepository.save(topic);
    }

    @Override
    public Topic updateTopic(Long id, Topic topicDetails) {
        Topic topic = getTopicById(id);
        topic.setTitle(topicDetails.getTitle());
        topic.setDescription(topicDetails.getDescription());
        topic.setThumbnailUrl(topicDetails.getThumbnailUrl());
        topic.setOrderIndex(topicDetails.getOrderIndex());
        topic.setUpdateAt(LocalDateTime.now());
        return topicRepository.save(topic);
    }

    @Override
    public void deleteTopic(Long id) {
        Topic topic = getTopicById(id);
        topic.setIsDelete(true);
        topic.setUpdateAt(LocalDateTime.now());
        topicRepository.save(topic);
    }
}
