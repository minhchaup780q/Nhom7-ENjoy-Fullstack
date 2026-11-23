import type { PartAnswer } from '../../exam/types';

/**
 * Chấm điểm tại chỗ cho chế độ Admin xem trước / làm thử đề thi.
 *
 * Bám đúng quy tắc chấm của backend (ExamServiceImpl):
 * - Hầu hết các phần khớp theo THỨ TỰ mảng, bỏ qua câu is_example.
 * - Đọc Part 4 khớp theo `position`.
 * - Đọc Part 5 khớp theo `groupIndex` + `questionIndex`.
 *
 * Mục đích là để admin soi lại đáp án mình vừa nhập, nên kết quả luôn hiện đáp án đúng.
 */

export interface ScoreRow {
  label: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface PartScoreResult {
  rows: ScoreRow[];
  correct: number;
  total: number;
}

const norm = (v: unknown) => String(v ?? '').trim().toLowerCase();

const emptyResult = (): PartScoreResult => ({ rows: [], correct: 0, total: 0 });

/** Lấy đáp án user theo thứ tự câu (dùng cho các phần khớp bằng index). */
const answerByIndex = (answers: PartAnswer[], index: number): string =>
  answers.find((a) => a.index === index)?.answer ?? '';

const buildResult = (rows: ScoreRow[]): PartScoreResult => ({
  rows,
  correct: rows.filter((r) => r.isCorrect).length,
  total: rows.length,
});

/** Chấm các phần dạng "mảng câu hỏi khớp theo thứ tự", lấy đáp án đúng từ 1 field. */
const scoreSequential = (
  items: any[],
  answers: PartAnswer[],
  correctField: string,
  uppercase = false,
): PartScoreResult => {
  const actual = items.filter((it) => !it?.is_example);
  const rows = actual.map((it, i) => {
    const expected = uppercase
      ? String(it?.[correctField] ?? '').trim().toUpperCase()
      : String(it?.[correctField] ?? '');
    const given = answerByIndex(answers, i);
    const isCorrect = uppercase
      ? given.trim().toUpperCase() === expected
      : norm(given) === norm(expected);
    return {
      label: `Câu ${i + 1}`,
      correctAnswer: expected,
      userAnswer: given,
      isCorrect,
    };
  });
  return buildResult(rows);
};

export const scoreListeningPart = (
  partKey: string,
  data: any,
  answers: PartAnswer[],
): PartScoreResult => {
  if (!data) return emptyResult();

  switch (partKey) {
    case 'part1':
    case 'part4':
      return scoreSequential(data.coordinates || [], answers, 'word');
    case 'part2':
      return scoreSequential(data.questions || [], answers, 'keyword');
    case 'part3':
      return scoreSequential(data.questions || [], answers, 'answer', true);
    default:
      return emptyResult();
  }
};

export const scoreReadingPart = (
  partKey: string,
  data: any,
  answers: PartAnswer[],
): PartScoreResult => {
  if (!data) return emptyResult();

  switch (partKey) {
    case 'part1':
      return scoreSequential(Array.isArray(data) ? data : [], answers, 'status');
    case 'part2':
      return scoreSequential(data.questions || [], answers, 'status');
    case 'part3':
      return scoreSequential(Array.isArray(data) ? data : [], answers, 'word');

    case 'part4': {
      // Khớp theo position, không theo thứ tự mảng
      const expected: any[] = data.answers || [];
      const rows = expected.map((ans) => {
        const given = answers.find((a) => a.position === ans.position)?.answer ?? '';
        return {
          label: `Chỗ trống (${ans.position})`,
          correctAnswer: String(ans.word ?? ''),
          userAnswer: given,
          isCorrect: norm(given) === norm(ans.word),
        };
      });
      return buildResult(rows);
    }

    case 'part5': {
      // Khớp theo groupIndex + questionIndex
      const groups: any[] = Array.isArray(data) ? data : [];
      const rows: ScoreRow[] = [];
      groups.forEach((group, gi) => {
        const questions: any[] = (group?.questions || []).filter((q: any) => !q?.is_example);
        questions.forEach((q, qi) => {
          const given =
            answers.find((a) => a.groupIndex === gi && a.questionIndex === qi)?.answer ?? '';
          const expected = String(q?.keyword ?? q?.answer ?? '');
          rows.push({
            label: `Nhóm ${gi + 1} — Câu ${qi + 1}`,
            correctAnswer: expected,
            userAnswer: given,
            isCorrect: norm(given) === norm(expected),
          });
        });
      });
      return buildResult(rows);
    }

    default:
      return emptyResult();
  }
};
