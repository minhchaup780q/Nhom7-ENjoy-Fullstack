package com.example.learningservice.services.impl;

import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.entities.LeaderboardEntry;
import com.example.learningservice.repositories.LeaderboardEntryRepository;
import com.example.learningservice.services.LeaderboardRedisService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaderboardRedisServiceImpl implements LeaderboardRedisService {

    private final StringRedisTemplate stringRedisTemplate;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final ObjectMapper objectMapper;

    private static final String ZSET_KEY_PREFIX = "leaderboard:zset:tournament:";
    private static final String HASH_KEY_PREFIX = "leaderboard:hash:user_info:";

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class UserInfoMeta {
        private String username;
        private String avatarUrl;
    }

    private String getZSetKey(Long tournamentId) {
        return ZSET_KEY_PREFIX + (tournamentId != null ? tournamentId : "current");
    }

    private String getHashKey(Long tournamentId) {
        return HASH_KEY_PREFIX + (tournamentId != null ? tournamentId : "current");
    }

    @Override
    public Double incrementUserXp(Long tournamentId, Long userId, int xpAmount, String username, String avatarUrl) {
        if (userId == null || xpAmount <= 0) {
            return 0.0;
        }

        String zsetKey = getZSetKey(tournamentId);
        String hashKey = getHashKey(tournamentId);
        String member = String.valueOf(userId);

        // 1. Thực hiện lệnh ZINCRBY trên Redis ZSET
        Double newScore = stringRedisTemplate.opsForZSet().incrementScore(zsetKey, member, xpAmount);

        // 2. Cập nhật thông tin profile người dùng vào Redis HASH để truy xuất tức thời không cần query DB
        try {
            String existingJson = (String) stringRedisTemplate.opsForHash().get(hashKey, member);
            String targetUsername = username;
            String targetAvatar = avatarUrl;

            if (existingJson != null) {
                UserInfoMeta existingMeta = objectMapper.readValue(existingJson, UserInfoMeta.class);
                if (targetUsername == null || targetUsername.isBlank()) {
                    targetUsername = existingMeta.getUsername();
                }
                if (targetAvatar == null || targetAvatar.isBlank()) {
                    targetAvatar = existingMeta.getAvatarUrl();
                }
            }

            UserInfoMeta meta = UserInfoMeta.builder()
                    .username(targetUsername != null && !targetUsername.isBlank() ? targetUsername : "Người dùng #" + userId)
                    .avatarUrl(targetAvatar)
                    .build();

            stringRedisTemplate.opsForHash().put(hashKey, member, objectMapper.writeValueAsString(meta));
        } catch (Exception e) {
            log.warn("Không thể lưu cache thông tin user #{} vào Redis Hash: {}", userId, e.getMessage());
        }

        log.debug("Redis ZINCRBY thành công: key={}, member={}, +{} XP -> Điểm mới: {}",
                zsetKey, member, xpAmount, newScore);
        return newScore;
    }

    @Override
    public List<LeaderboardResponseDto.LeaderboardUserDto> getTopUsers(Long tournamentId, int limit) {
        String zsetKey = getZSetKey(tournamentId);
        String hashKey = getHashKey(tournamentId);

        // Lấy danh sách Top N sắp xếp giảm dần theo điểm (ZREVRANGE)
        Set<ZSetOperations.TypedTuple<String>> tuples = stringRedisTemplate.opsForZSet()
                .reverseRangeWithScores(zsetKey, 0, Math.max(0, limit - 1));

        if (tuples == null || tuples.isEmpty()) {
            // Nếu Redis ZSET chưa có dữ liệu, thực hiện Warmup từ Database
            warmupLeaderboard(tournamentId);
            tuples = stringRedisTemplate.opsForZSet()
                    .reverseRangeWithScores(zsetKey, 0, Math.max(0, limit - 1));
        }

        if (tuples == null || tuples.isEmpty()) {
            return Collections.emptyList();
        }

        List<LeaderboardResponseDto.LeaderboardUserDto> result = new ArrayList<>();
        int rank = 1;

        for (ZSetOperations.TypedTuple<String> tuple : tuples) {
            String member = tuple.getValue();
            Double score = tuple.getScore();
            if (member == null) continue;

            Long userId;
            try {
                userId = Long.parseLong(member);
            } catch (NumberFormatException e) {
                continue;
            }

            String username = "Người dùng #" + userId;
            String avatarUrl = null;

            // Đọc metadata từ Redis Hash
            try {
                String metaJson = (String) stringRedisTemplate.opsForHash().get(hashKey, member);
                if (metaJson != null) {
                    UserInfoMeta meta = objectMapper.readValue(metaJson, UserInfoMeta.class);
                    if (meta.getUsername() != null && !meta.getUsername().isBlank()) {
                        username = meta.getUsername();
                    }
                    avatarUrl = meta.getAvatarUrl();
                }
            } catch (Exception e) {
                log.warn("Lỗi đọc metadata user #{} từ Redis Hash: {}", userId, e.getMessage());
            }

            int weeklyXp = score != null ? score.intValue() : 0;

            result.add(LeaderboardResponseDto.LeaderboardUserDto.builder()
                    .rank(rank)
                    .userId(userId)
                    .username(username)
                    .avatarUrl(avatarUrl)
                    .weeklyXp(weeklyXp)
                    .isCurrentUser(false)
                    .isPromoting(rank <= 12)
                    .build());

            rank++;
        }

        return result;
    }

    @Override
    public void warmupLeaderboard(Long tournamentId) {
        if (tournamentId == null) {
            return;
        }

        String zsetKey = getZSetKey(tournamentId);
        String hashKey = getHashKey(tournamentId);

        List<LeaderboardEntry> entries = leaderboardEntryRepository
                .findByTournamentIdOrderByWeeklyXpDescLastXpUpdatedAtAsc(tournamentId, PageRequest.of(0, 50));

        if (entries.isEmpty()) {
            return;
        }

        log.info("Thực hiện Warmup Redis ZSET từ DB cho giải đấu #{}: {} bản ghi", tournamentId, entries.size());

        for (LeaderboardEntry entry : entries) {
            String member = String.valueOf(entry.getUserId());
            int xp = entry.getWeeklyXp() != null ? entry.getWeeklyXp() : 0;
            stringRedisTemplate.opsForZSet().add(zsetKey, member, xp);

            try {
                UserInfoMeta meta = UserInfoMeta.builder()
                        .username(entry.getUsername() != null ? entry.getUsername() : "Người dùng #" + entry.getUserId())
                        .avatarUrl(entry.getAvatarUrl())
                        .build();
                stringRedisTemplate.opsForHash().put(hashKey, member, objectMapper.writeValueAsString(meta));
            } catch (JsonProcessingException e) {
                log.warn("Lỗi tuần tự hóa metadata user #{}: {}", entry.getUserId(), e.getMessage());
            }
        }
    }
}
