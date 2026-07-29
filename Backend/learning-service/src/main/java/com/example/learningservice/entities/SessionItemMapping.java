package com.example.learningservice.entities;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "session_item_mappings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionItemMapping extends BaseEntity {

    @EmbeddedId
    private SessionItemMappingId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sessionId") // Biến này phải khớp y hệt tên biến bên file SessionItemMappingId
    @JoinColumn(name = "session_id")
    @JsonIgnoreProperties({"itemMappings", "hibernateLazyInitializer", "handler"})
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sessionItemId") // Biến này phải khớp y hệt tên biến bên file SessionItemMappingId
    @JoinColumn(name = "session_item_id")
    @JsonIgnoreProperties({"sessionMappings", "hibernateLazyInitializer", "handler"})
    private SessionItem sessionItem;

    @Column(name = "order_index")
    private Integer orderIndex;
}