package com.example.learningservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "community_chat_messages",
    indexes = {
        @Index(name = "idx_chat_created_at", columnList = "create_at"),
        @Index(name = "idx_chat_user_id", columnList = "user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityChatMessage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "message_type", length = 20)
    @Builder.Default
    private String messageType = "TEXT";
}
