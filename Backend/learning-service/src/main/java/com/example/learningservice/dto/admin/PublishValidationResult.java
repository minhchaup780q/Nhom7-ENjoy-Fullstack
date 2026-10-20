package com.example.learningservice.dto.admin;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublishValidationResult {
    private boolean valid;
    private String message;

    @Builder.Default
    private List<String> errors = new ArrayList<>();

    public static PublishValidationResult success(String message) {
        return PublishValidationResult.builder()
                .valid(true)
                .message(message)
                .errors(new ArrayList<>())
                .build();
    }

    public static PublishValidationResult failed(String message, List<String> errors) {
        return PublishValidationResult.builder()
                .valid(false)
                .message(message)
                .errors(errors != null ? errors : new ArrayList<>())
                .build();
    }
}
