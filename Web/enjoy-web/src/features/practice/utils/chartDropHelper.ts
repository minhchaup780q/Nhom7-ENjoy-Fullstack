import type { ExamHistoryStat } from '../../exam/types';

export interface ChartDropAnalysis {
  hasDroppedOver15: boolean;
  maxDropPercent: number; // e.g. -20
  dropSkill: 'listening' | 'reading' | 'both' | 'none';
  detailMessage: string;
  listeningDropPercent: number;
  readingDropPercent: number;
}

/**
 * Tính toán xu hướng biểu đồ bài thi:
 * Chỉ khi nào biểu đồ bài thi giảm quá 15% (<= -15%) ở kỹ năng Nghe hoặc Đọc & Viết,
 * hệ thống mới kích hoạt tính toán và hiển thị luyện tập chuyên sâu Topic & Grammar.
 */
export const analyzeChartDropOver15 = (
  histories?: ExamHistoryStat[],
  simulateDrop: boolean = false
): ChartDropAnalysis => {
  if (simulateDrop) {
    return {
      hasDroppedOver15: true,
      maxDropPercent: -20,
      dropSkill: 'both',
      detailMessage: 'Chế độ mô phỏng: Điểm bài thi giảm 20% so với bài trước.',
      listeningDropPercent: -20,
      readingDropPercent: -20,
    };
  }

  if (!histories || histories.length < 2) {
    return {
      hasDroppedOver15: false,
      maxDropPercent: 0,
      dropSkill: 'none',
      detailMessage: 'Chưa có đủ lịch sử bài thi (cần ít nhất 2 bài thi) để so sánh xu hướng biểu đồ.',
      listeningDropPercent: 0,
      readingDropPercent: 0,
    };
  }

  // So sánh bài thi gần nhất (last) với bài ngay trước đó (prev)
  const last = histories[histories.length - 1];
  const prev = histories[histories.length - 2];

  // Listening: tối đa 20 câu
  const listeningDiff = (last.listeningScore ?? 0) - (prev.listeningScore ?? 0);
  const listeningDropPercent = Math.round((listeningDiff / 20) * 100);

  // Reading: tối đa 25 câu
  const readingDiff = (last.readingScore ?? 0) - (prev.readingScore ?? 0);
  const readingDropPercent = Math.round((readingDiff / 25) * 100);

  const listeningDropped = listeningDropPercent <= -15;
  const readingDropped = readingDropPercent <= -15;
  const hasDroppedOver15 = listeningDropped || readingDropped;

  const maxDropPercent = Math.min(listeningDropPercent, readingDropPercent);

  let dropSkill: 'listening' | 'reading' | 'both' | 'none' = 'none';
  if (listeningDropped && readingDropped) dropSkill = 'both';
  else if (listeningDropped) dropSkill = 'listening';
  else if (readingDropped) dropSkill = 'reading';

  let detailMessage = '';
  if (hasDroppedOver15) {
    if (dropSkill === 'both') {
      detailMessage = `Điểm Nghe giảm ${Math.abs(listeningDropPercent)}% và Đọc & Viết giảm ${Math.abs(readingDropPercent)}% so với bài thi trước.`;
    } else if (dropSkill === 'listening') {
      detailMessage = `Điểm phần Nghe giảm ${Math.abs(listeningDropPercent)}% so với bài thi trước.`;
    } else {
      detailMessage = `Điểm phần Đọc & Viết giảm ${Math.abs(readingDropPercent)}% so với bài thi trước.`;
    }
  } else {
    detailMessage = 'Biểu đồ điểm số đang duy trì ổn định hoặc có tiến bộ (không giảm quá 15%).';
  }

  return {
    hasDroppedOver15,
    maxDropPercent,
    dropSkill,
    detailMessage,
    listeningDropPercent,
    readingDropPercent,
  };
};
