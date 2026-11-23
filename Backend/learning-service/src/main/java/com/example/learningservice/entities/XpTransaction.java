package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.XpSourceType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "xp_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XpTransaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "xp_amount", nullable = false)
    private Integer xpAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 50)
    private XpSourceType sourceType;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "description", length = 255)
    private String description;
}
