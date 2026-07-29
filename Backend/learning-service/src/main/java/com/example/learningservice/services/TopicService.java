package com.example.learningservice.services;

import com.example.learningservice.entities.Topic;
import java.util.List;

public interface TopicService {
    List<Topic> getTopicsByLevel(Long levelId);
    Topic getTopicById(Long id);
    Topic createTopic(Long levelId, Topic topic);
    Topic updateTopic(Long id, Topic topicDetails);
    void deleteTopic(Long id);
}
