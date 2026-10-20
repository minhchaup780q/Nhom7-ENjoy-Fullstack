package com.example.learningservice.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPartRequest {
    private Long topicId;

    @NotBlank(message = "Tiêu đề Part không được để trống")
    @Size(max = 200, message = "Tiêu đề Part tối đa 200 ký tự")
    private String title;

    private Integer orderIndex;
}
