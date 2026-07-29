package com.example.learningservice.entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "topics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Topic extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id")
    @JsonIgnoreProperties({"topics", "hibernateLazyInitializer", "handler"})
    private Level level;

    private String title;
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "order_index")
    private Integer orderIndex;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("topic")
    private List<Part> parts;
}