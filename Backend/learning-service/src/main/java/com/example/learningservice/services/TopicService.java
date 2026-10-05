package com.example.learningservice.services;

import com.example.learningservice.dto.TopicWithProgressDto;
import com.example.learningservice.entities.Topic;
import java.util.List;

public interface TopicService {
    List<Topic> getTopicsByLevel(Long levelId);
    Topic getTopicById(Long id);
    Topic createTopic(Long levelId, Topic topic);
    Topic updateTopic(Long id, Topic topicDetails);
    void deleteTopic(Long id);

    /**
     * Trả về danh sách topic kèm grammar name và trạng thái học của user.
     * Dùng cho trang Learn để render danh sách topic đã được cá nhân hóa.
     */
    List<TopicWithProgressDto> getTopicsWithProgress(Long levelId, Long userId);
}

