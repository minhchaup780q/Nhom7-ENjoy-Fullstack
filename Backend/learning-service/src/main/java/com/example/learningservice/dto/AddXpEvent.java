package com.example.learningservice.dto;

import com.example.learningservice.entities.enums.XpSourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Sự kiện cộng điểm kinh nghiệm (XP) được đóng gói và gửi vào RabbitMQ
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddXpEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private int xpAmount;
    private XpSourceType sourceType;
    private Long sourceId;
    private String description;
    private String username;
    private String avatarUrl;
    private LocalDateTime timestamp;
}
