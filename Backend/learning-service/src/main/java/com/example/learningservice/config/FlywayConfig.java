package com.example.learningservice.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * Chạy Flyway SAU khi Hibernate đã tạo xong bảng.
 * Lý do: spring.flyway.enabled=false → Spring không tự chạy Flyway lúc khởi động.
 * Khi ApplicationReadyEvent phát ra, toàn bộ bean (bao gồm JPA/Hibernate) đã init xong,
 * các bảng đã tồn tại, lúc đó mới gọi flyway.migrate() để chạy các file INSERT data.
 */
@Component
public class FlywayConfig {

    private final DataSource dataSource;

    public FlywayConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runFlywayAfterHibernate() {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .load();
        flyway.migrate();
    }
}
