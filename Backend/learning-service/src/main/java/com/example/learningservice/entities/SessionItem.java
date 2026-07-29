package com.example.learningservice.entities;


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

    @Column(name = "item_type")
    private String itemType;

    @OneToMany(mappedBy = "sessionItem", cascade = CascadeType.ALL)
    private List<SessionItemMapping> sessionMappings;
}