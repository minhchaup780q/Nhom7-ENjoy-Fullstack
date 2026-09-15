package edu.vn.iuh.fit.admin.services;

import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import java.util.Map;

public interface AdminUserService {
    UserCountResponse getUserCount();

    Map<String, Long> getRolesCount();

    Map<String, Long> getActivityStats();
}
