package edu.vn.iuh.fit.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActiveStatsResponse {
    private long dau;
    private long mau;
    // (DAU / MAU) * 100, làm tròn 1 chữ số thập phân
    private double stickinessRatio;
}
