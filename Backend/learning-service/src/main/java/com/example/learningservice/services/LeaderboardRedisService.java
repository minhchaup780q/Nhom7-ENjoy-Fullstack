package com.example.learningservice.services;

import com.example.learningservice.dto.LeaderboardResponseDto;

import java.util.List;

public interface LeaderboardRedisService {

    /**
     * Tăng điểm XP của user trong Redis ZSET bằng lệnh ZINCRBY
     */
    Double incrementUserXp(Long tournamentId, Long userId, int xpAmount, String username, String avatarUrl);

    /**
     * Lấy Top N người dùng điểm cao nhất bằng lệnh ZREVRANGE
     */
    List<LeaderboardResponseDto.LeaderboardUserDto> getTopUsers(Long tournamentId, int limit);

    /**
     * Khởi tạo / nạp dữ liệu từ DB vào Redis ZSET nếu cache đang trống
     */
    void warmupLeaderboard(Long tournamentId);
}
