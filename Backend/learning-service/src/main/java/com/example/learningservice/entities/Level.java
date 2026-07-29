package com.example.learningservice.entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "levels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Level extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;

    @Column(name = "order_index")
    private Integer orderIndex;

    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("level")
    private List<Topic> topics;
}