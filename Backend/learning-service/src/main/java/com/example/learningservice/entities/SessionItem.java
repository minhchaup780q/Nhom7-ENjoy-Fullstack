package com.example.learningservice.entities;


import com.example.learningservice.entities.enums.SessionItemType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "session_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionItem extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(columnDefinition = "TEXT")
    private String translation;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type")
    private SessionItemType itemType;

    private String keyword;

    @OneToMany(mappedBy = "sessionItem", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("sessionItem")
    private List<SessionItemMapping> sessionMappings;
}