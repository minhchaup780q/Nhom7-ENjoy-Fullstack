package com.example.learningservice.services;

import com.example.learningservice.entities.Topic;
import com.example.learningservice.repositories.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicById(Integer id) {
        return topicRepository.findById(id).orElseThrow(() -> new RuntimeException("Topic not found"));
    }
}