package edu.vn.iuh.fit.admin.services.impl;

import edu.vn.iuh.fit.admin.client.UserClient;
import edu.vn.iuh.fit.admin.dto.response.UserCountResponse;
import edu.vn.iuh.fit.admin.services.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserClient userClient;

    @Override
    public UserCountResponse getUserCount() {
        long count = 0L;
        try {
            Long fetchedCount = userClient.getTotalUserCount();
            if (fetchedCount != null) {
                count = fetchedCount;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign in AdminUserServiceImpl: " + e.getMessage());
        }

        return UserCountResponse.builder()
                .totalUsers(count)
                .build();
    }

    @Override
    public Map<String, Long> getRolesCount() {
        try {
            return userClient.countUsersByRole();
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign for roles count: " + e.getMessage());
            return new HashMap<>();
        }
    }

    @Override
    public Map<String, Long> getActivityStats() {
        try {
            return userClient.getParentActivityStats();
        } catch (Exception e) {
            System.err.println("⚠️ Error calling user-service via OpenFeign for activity stats: " + e.getMessage());
            return new HashMap<>();
        }
    }
}
