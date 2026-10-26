// Thang màu heatmap cho các ô tỉ lệ giữ chân (Day 1/7/14 và Churn 14).
// Tỉ lệ càng cao càng xanh đậm; càng thấp càng nhạt rồi chuyển đỏ.
// null = mốc chưa tới (chưa đủ dữ liệu) -> ô xám trung tính, hiển thị "—".

export interface RetentionCellStyle {
  /** Class nền + chữ cho ô */
  className: string;
  /** Nội dung hiển thị: "x,x%" hoặc "—" khi chưa có dữ liệu */
  label: string;
  /** true khi mốc chưa tới (null) */
  isPending: boolean;
}

export const getRetentionCellStyle = (rate: number | null): RetentionCellStyle => {
  if (rate === null || rate === undefined) {
    return { className: 'bg-slate-50 text-slate-400', label: '—', isPending: true };
  }

  const label = `${rate.toLocaleString('vi-VN')}%`;
  let className: string;

  if (rate >= 50) {
    className = 'bg-emerald-600 text-white'; // Xuất sắc
  } else if (rate >= 30) {
    className = 'bg-emerald-300 text-emerald-900'; // Khá
  } else if (rate >= 15) {
    className = 'bg-cyan-100 text-cyan-700'; // Trung bình
  } else if (rate >= 5) {
    className = 'bg-amber-50 text-amber-700'; // Thấp, rơi rụng nhiều
  } else {
    className = 'bg-red-100 text-red-700'; // Rất thấp / báo động
  }

  return { className, label, isPending: false };
};

// Churn ngược chiều với retention: churn CAO là XẤU (đỏ), churn THẤP là TỐT (xanh).
// Tô màu theo "độ khoẻ" = 100 − churn để tái dùng cùng thang, nhưng hiển thị đúng % churn.
export const getChurnCellStyle = (churnRate: number | null): RetentionCellStyle => {
  if (churnRate === null || churnRate === undefined) {
    return { className: 'bg-slate-50 text-slate-400', label: '—', isPending: true };
  }
  const style = getRetentionCellStyle(100 - churnRate);
  return { ...style, label: `${churnRate.toLocaleString('vi-VN')}%` };
};

// Mô tả các mức cho phần chú thích (legend) dưới bảng
export const RETENTION_LEVELS: { range: string; meaning: string; className: string }[] = [
  { range: '≥ 50%', meaning: 'Giữ chân xuất sắc', className: 'bg-emerald-600 text-white' },
  { range: '30 – 49%', meaning: 'Khá', className: 'bg-emerald-300 text-emerald-900' },
  { range: '15 – 29%', meaning: 'Trung bình', className: 'bg-cyan-100 text-cyan-700' },
  { range: '5 – 14%', meaning: 'Thấp, rơi rụng nhiều', className: 'bg-amber-50 text-amber-700' },
  { range: '< 5%', meaning: 'Báo động, gần như bỏ app', className: 'bg-red-100 text-red-700' },
];
