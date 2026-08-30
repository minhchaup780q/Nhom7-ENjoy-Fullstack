package edu.vn.iuh.fit.authservice.dto.request;

import edu.vn.iuh.fit.authservice.entities.enums.AuthProvider;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PendingRegistrationDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String email;
    private String passwordHash;
    private String username;
    private LocalDate birthday;
    private UserRole role; // ROLE_CHILDREN, ROLE_PARENT
    private AuthProvider provider; // LOCAL
}
