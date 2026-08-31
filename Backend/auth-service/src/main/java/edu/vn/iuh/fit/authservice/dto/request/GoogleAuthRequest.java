package edu.vn.iuh.fit.authservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoogleAuthRequest {
    private String email;
    private String name;
    private String googleId;
    private LocalDate birthday; // Optional: provided if prompt modal submitted
}
