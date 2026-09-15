package com.example.learningservice.dto;

import com.example.learningservice.entities.enums.MistakeStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MistakeStatusUpdateRequest {
    private MistakeStatus status;
}
