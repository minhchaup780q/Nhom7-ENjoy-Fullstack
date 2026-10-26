package com.example.learningservice.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTopicRequest {
    private Long levelId;

    @NotBlank(message = "Tiêu đề Topic không được để trống")
    @Size(max = 200, message = "Tiêu đề Topic tối đa 200 ký tự")
    private String title;

    private String description;
    private String thumbnailUrl;
    private Integer orderIndex;
}
