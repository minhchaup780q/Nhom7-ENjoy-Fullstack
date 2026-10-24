package com.example.learningservice.services;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.learningservice.dto.LeaderboardResponseDto;
import com.example.learningservice.entities.Tournament;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Luồng Scheduled định kỳ mỗi 1 giây lấy Top 10 bảng xếp hạng từ Redis ZSET (ZREVRANGE)
 * và sử dụng Netty Socket.IO để broadcast danh sách mới nhất xuống tất cả Client đang kết nối.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LeaderboardRealtimeBroadcaster {

    public static final String EVENT_LEADERBOARD_UPDATE = "leaderboard_update";
    public static final String EVENT_TOP10 = "leaderboard:top10";

    private final SocketIOServer socketIOServer;
    private final LeaderboardRedisService leaderboardRedisService;
    private final LeaderboardService leaderboardService;

    @PostConstruct
    public void registerSocketListeners() {
        // Khi client vừa kết nối, đẩy ngay Top 10 hiện tại cho client đó mà không cần chờ tới nhịp 1s
        socketIOServer.addConnectListener(client -> {
            try {
                Tournament tournament = leaderboardService.getOrCreateCurrentTournament();
                Long tournamentId = tournament != null ? tournament.getId() : 1L;
                List<LeaderboardResponseDto.LeaderboardUserDto> top10 = leaderboardRedisService.getTopUsers(tournamentId, 10);
                if (top10 != null && !top10.isEmpty()) {
                    client.sendEvent(EVENT_LEADERBOARD_UPDATE, top10);
                    client.sendEvent(EVENT_TOP10, top10);
                }
            } catch (Exception e) {
                log.warn("Không thể gửi dữ liệu khởi tạo cho client vừa kết nối: {}", e.getMessage());
            }
        });

        // Cho phép client chủ động yêu cầu Top 10 bất kỳ lúc nào
        socketIOServer.addEventListener("request_leaderboard", String.class, (client, data, ackSender) -> {
            try {
                Tournament tournament = leaderboardService.getOrCreateCurrentTournament();
                Long tournamentId = tournament != null ? tournament.getId() : 1L;
                List<LeaderboardResponseDto.LeaderboardUserDto> top10 = leaderboardRedisService.getTopUsers(tournamentId, 10);
                client.sendEvent(EVENT_LEADERBOARD_UPDATE, top10);
            } catch (Exception e) {
                log.warn("Lỗi khi client yêu cầu dữ liệu bảng xếp hạng: {}", e.getMessage());
            }
        });
    }

    /**
     * Luồng chạy định kỳ cứ mỗi 1 giây (1000ms):
     * 1. Lấy giải đấu hiện tại
     * 2. Gọi lệnh ZREVRANGE từ Redis ZSET lấy Top 10
     * 3. Broadcast sự kiện xuống tất cả các client đang kết nối qua Socket.IO
     */
    @Scheduled(fixedRate = 1000)
    public void broadcastRealtimeTop10() {
        try {
            // Kiểm tra nếu không có client nào kết nối thì có thể bỏ qua broadcast để tối ưu hiệu năng
            if (socketIOServer.getAllClients().isEmpty()) {
                return;
            }

            Tournament tournament = leaderboardService.getOrCreateCurrentTournament();
            Long tournamentId = tournament != null ? tournament.getId() : 1L;

            // Lấy Top 10 từ Redis ZSET (ZREVRANGE)
            List<LeaderboardResponseDto.LeaderboardUserDto> top10 = leaderboardRedisService.getTopUsers(tournamentId, 10);

            if (top10 != null && !top10.isEmpty()) {
                // Broadcast dữ liệu bảng xếp hạng thời gian thực tới tất cả các client đang kết nối
                socketIOServer.getBroadcastOperations().sendEvent(EVENT_LEADERBOARD_UPDATE, top10);
                socketIOServer.getBroadcastOperations().sendEvent(EVENT_TOP10, top10);
                log.debug("[Broadcast 1s] Đã gửi Top 10 mới nhất tới {} client", socketIOServer.getAllClients().size());
            }
        } catch (Exception e) {
            log.error("Lỗi trong quá trình broadcast bảng xếp hạng realtime: {}", e.getMessage());
        }
    }
}
