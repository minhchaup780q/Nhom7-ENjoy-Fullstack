package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityChatPageResponseDto {
    private List<CommunityChatMessageDto> messages;
    private boolean hasMore;
    private Long oldestId;
    private int totalReturned;
}
