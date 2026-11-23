package com.example.learningservice.workers;

import com.example.learningservice.config.RabbitMQConfig;
import com.example.learningservice.dto.AddXpEvent;
import com.example.learningservice.entities.Tournament;
import com.example.learningservice.services.LeaderboardRedisService;
import com.example.learningservice.services.LeaderboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Worker chạy ngầm hứng sự kiện AddXpEvent từ RabbitMQ.
 * Xử lý:
 * 1. Tự động cập nhật điểm vào Redis ZSET bằng lệnh ZINCRBY (thần tốc trong RAM)
 * 2. Lưu trữ điểm và lịch sử bền vững vào MariaDB (UserRankProfile, LeaderboardEntry, XpTransaction)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class XpEventConsumer {

    private final LeaderboardRedisService leaderboardRedisService;
    private final LeaderboardService leaderboardService;

    @RabbitListener(queues = RabbitMQConfig.XP_QUEUE)
    public void handleAddXpEvent(AddXpEvent event) {
        if (event == null || event.getUserId() == null || event.getXpAmount() <= 0) {
            log.warn("Bỏ qua sự kiện AddXpEvent không hợp lệ: {}", event);
            return;
        }

        log.info("--> [RabbitMQ Worker] Bắt đầu xử lý AddXpEvent cho User #{} (+{} XP, Nguồn: {})",
                event.getUserId(), event.getXpAmount(), event.getSourceType());

        try {
            // Lấy giải đấu tuần hiện tại
            Tournament tournament = leaderboardService.getOrCreateCurrentTournament();
            Long tournamentId = tournament != null ? tournament.getId() : 1L;

            // 1. Cập nhật điểm tức thì vào Redis ZSET bằng lệnh ZINCRBY
            Double newScore = leaderboardRedisService.incrementUserXp(
                    tournamentId,
                    event.getUserId(),
                    event.getXpAmount(),
                    event.getUsername(),
                    event.getAvatarUrl()
            );

            log.info("--> [Redis ZSET ZINCRBY] User #{} đạt điểm tuần mới: {} XP", event.getUserId(), newScore);

            // 2. Lưu trữ dữ liệu vào Database MariaDB ở dưới nền (bền vững và không làm nghẽn API)
            leaderboardService.saveXpToDatabase(event);

            log.info("<-- [RabbitMQ Worker] Hoàn tất xử lý AddXpEvent cho User #{}", event.getUserId());
        } catch (Exception e) {
            log.error("Lỗi khi xử lý sự kiện AddXpEvent: {}", e.getMessage(), e);
            // Trong thực tế có thể ném exception để RabbitMQ retry hoặc đưa vào Dead Letter Queue (DLQ)
        }
    }
}
