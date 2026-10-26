package edu.vn.iuh.fit.admin.services;

import edu.vn.iuh.fit.admin.dto.response.OverviewResponse;
import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import java.util.Map;

public interface AdminUserService {
    UserCountResponse getUserCount();

    Map<String, Long> getRolesCount();

    Map<String, Long> getActivityStats();

    // Tổng user + % tăng so với tháng trước + DAU/MAU/Stickiness cho trang Overview
    OverviewResponse getOverview();
}
