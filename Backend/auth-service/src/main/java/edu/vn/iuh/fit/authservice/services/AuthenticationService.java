package edu.vn.iuh.fit.authservice.services;

import edu.vn.iuh.fit.authservice.dto.request.LoginRequest;
import edu.vn.iuh.fit.authservice.dto.response.LoginResponse;

public interface AuthenticationService {

    LoginResponse login(LoginRequest request);
}
