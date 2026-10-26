package edu.vn.iuh.fit.authservice.jobs;

import edu.vn.iuh.fit.authservice.services.ActiveUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DailyActiveFlushJob {

    // Số ngày nhìn lại khi chạy bù (khớp với TTL của key dau:* trong Redis)
    private static final int CATCH_UP_DAYS = 3;

    private final ActiveUserService activeUserService;

    // 00:05 mỗi ngày: ghi dữ liệu của ngày hôm qua từ Redis xuống DB.
    // Chạy sau nửa đêm thay vì 23:59 để không bỏ sót các lượt đăng nhập phút cuối.
    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void flushYesterday() {
        flush(activeUserService.today().minusDays(1));
    }

    // Chạy bù những ngày chưa được flush (vd. service tắt đúng lúc job chạy)
    @EventListener(ApplicationReadyEvent.class)
    public void catchUpOnStartup() {
        LocalDate today = activeUserService.today();
        for (int i = CATCH_UP_DAYS; i >= 1; i--) {
            LocalDate date = today.minusDays(i);
            if (!activeUserService.isDayFlushed(date)) {
                flush(date);
            }
        }
    }

    private void flush(LocalDate date) {
        try {
            activeUserService.flushDay(date);
            // Chỉ xóa key Redis sau khi đã commit DB thành công
            activeUserService.clearRedisDay(date);
            System.out.println("📊 Flushed daily active users for " + date);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to flush daily active users for " + date + ": " + e.getMessage());
        }
    }
}
