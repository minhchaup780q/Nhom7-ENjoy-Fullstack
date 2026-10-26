package com.example.learningservice.dto.admin;

import com.example.learningservice.entities.enums.SessionType;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.example.learningservice.entities.RawJsonDeserializer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSessionRequest {
    private Long partId;

    @NotBlank(message = "Tiêu đề bài học không được để trống")
    @Size(max = 200, message = "Tiêu đề bài học tối đa 200 ký tự")
    private String title;

    private String description;

    @NotNull(message = "Loại bài học (sessionType) không được để trống")
    private SessionType sessionType;

    private Long badgeId;
    private Integer orderIndex;

    /**
     * Payload bài tập dạng JSON string hoặc raw JSON object
     */
    @JsonRawValue
    @JsonDeserialize(using = RawJsonDeserializer.class)
    private String payload;

    @JsonSetter("payload")
    public void setPayloadFromJsonNode(JsonNode node) {
        if (node == null || node.isNull()) {
            this.payload = null;
        } else if (node.isTextual()) {
            this.payload = node.asText();
        } else {
            this.payload = node.toString();
        }
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}

