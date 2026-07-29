package com.example.learningservice.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class SessionItemMappingId implements Serializable {

    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "session_item_id")
    private Long sessionItemId;
}