package com.example.learningservice.dto;

import com.example.learningservice.entities.enums.XpSourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddXpRequestDto {
    private Long userId;
    private int xpAmount;
    private XpSourceType sourceType;
    private Long sourceId;
    private String description;
    private String username;
    private String avatarUrl;
}
