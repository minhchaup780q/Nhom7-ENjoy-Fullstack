package com.example.learningservice.dto;

import com.example.learningservice.entities.Vocabulary;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VocabularyDto {
    private Long id;
    private String word;
    private String translation;
    private String imageUrl;
    private String audioUrl;

    public static VocabularyDto fromEntity(Vocabulary v) {
        return VocabularyDto.builder()
                .id(v.getId())
                .word(v.getWord())
                .translation(v.getTranslation())
                .imageUrl(v.getImageUrl())
                .audioUrl(v.getAudioUrl())
                .build();
    }
}
