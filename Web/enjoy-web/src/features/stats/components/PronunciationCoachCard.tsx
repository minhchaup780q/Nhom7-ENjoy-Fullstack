import React from 'react';
import {
  resolvePronunciationAnalysis,
  type PronunciationAnalysisData,
} from '../../learning/services/pronunciationHelper';
import { renderFormattedAiText } from './FormattedAiText';

interface Props {
  targetWord: string;
  userWord: string;
  translation?: string;
  cachedJson?: string | null;
  isPlaying?: boolean;
  isRecording?: boolean;
  assessmentResult?: { isCorrect: boolean; score: number; message: string };
  onPlayWord: () => void;
  onToggleRecord: () => void;
  onOpenGuide: (phoneme: string) => void;
  onStartPractice: () => void;
}

export const PronunciationCoachCard: React.FC<Props> = ({
  targetWord,
  userWord,
  translation,
  cachedJson,
  isPlaying = false,
  isRecording = false,
  assessmentResult,
  onPlayWord,
  onToggleRecord,
  onOpenGuide,
  onStartPractice,
}) => {
  const analysis: PronunciationAnalysisData = React.useMemo(() => {
    return resolvePronunciationAnalysis(targetWord, userWord, translation, cachedJson);
  }, [targetWord, userWord, translation, cachedJson]);

  const primaryFixPhoneme = analysis.primaryPhoneme || analysis.differences[0]?.from?.replace(/[\/]/g, '') || 's';

  const isSentence = targetWord.trim().includes(' ') || analysis.phonemes.some(p => p.target.length > 3);

  return (
    <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-pink-200 transition-all space-y-5 text-slate-800">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {analysis.targetWord}
            </span>
            <button
              onClick={onPlayWord}
              className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-[#ff5e97] border-[#ff5e97] text-white'
                  : 'bg-white hover:bg-pink-50 text-[#ff5e97] border-pink-200'
              }`}
            >
              {isPlaying ? 'Đang phát...' : 'Phát âm'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-mono font-bold text-[#ff5e97] bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
              {analysis.targetIPA}
            </span>
            <span className="text-slate-500 font-medium">
              ({analysis.targetMeaning})
            </span>
          </div>
        </div>

        {/* Badge âm vị / câu */}
        <div className="flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded-xl bg-pink-50/50 border border-pink-100 text-slate-600 text-xs font-mono font-bold">
          {isSentence ? (
            <span className="text-[#ff5e97] font-bold font-sans">Luyện nói câu</span>
          ) : (
            analysis.phonemes.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className={p.status !== 'match' ? 'text-[#ff5e97] font-bold' : 'text-slate-600'}>
                  {p.target}
                </span>
                {idx < analysis.phonemes.length - 1 && <span className="text-pink-200">·</span>}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* 2. So sánh phát âm */}
      <div className="p-4 sm:p-5 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>{isSentence ? 'Phân tích từng từ trong câu' : 'Phân tích từng âm vị'}</span>
          <span className="text-[#ff5e97]">So sánh chuẩn vs nhận diện</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-fit space-y-3">
            
            {/* Hàng 1: Chuẩn */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 shrink-0">
                <span className="text-[10px] font-bold uppercase text-[#ff5e97] bg-pink-100/70 px-2 py-0.5 rounded-md border border-pink-200 block w-fit mb-0.5">
                  {isSentence ? 'Câu chuẩn' : 'Chuẩn'}
                </span>
                <span className="font-bold text-sm text-slate-800">
                  {analysis.targetWord}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {analysis.phonemes.map((p, idx) => {
                  const isDiff = p.status === 'different';
                  const isMissing = p.status === 'missing';

                  return (
                    <div
                      key={idx}
                      className={`min-w-[42px] px-2.5 py-1.5 rounded-xl border text-center font-mono text-xs transition-all ${
                        isDiff
                          ? 'bg-pink-50 border-pink-300 text-[#ff5e97] font-bold'
                          : isMissing
                          ? 'bg-pink-50/70 border-2 border-dashed border-pink-300 text-[#ff5e97] font-bold'
                          : 'bg-white border-pink-100 text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="text-sm">{p.target}</div>
                      <div className="text-[9px] font-sans text-slate-400 mt-0.5">
                        {isDiff ? 'cần sửa' : isMissing ? 'thiếu' : 'đúng'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hàng 2: Bạn đọc */}
            <div className="flex items-center gap-3 pt-2 border-t border-pink-100/60">
              <div className="w-24 sm:w-28 shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md block w-fit mb-0.5">
                  Bạn đọc
                </span>
                <span className="font-bold text-sm text-slate-600">
                  {analysis.userWord}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {analysis.phonemes.map((p, idx) => {
                  const isDiff = p.status === 'different';
                  const isMissing = p.status === 'missing';

                  return (
                    <div
                      key={idx}
                      className={`min-w-[42px] px-2.5 py-1.5 rounded-xl border text-center font-mono text-xs transition-all ${
                        isDiff
                          ? 'bg-pink-100 border-pink-300 text-pink-900 font-bold'
                          : isMissing
                          ? 'bg-slate-100 border border-dashed border-slate-300 text-slate-400'
                          : 'bg-white border-pink-100 text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="text-sm">
                        {p.user || '—'}
                      </div>
                      <div className="text-[9px] font-sans text-slate-400 mt-0.5">
                        {isDiff ? 'lệch' : isMissing ? 'quên' : 'đúng'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Điểm khác biệt chính */}
      {analysis.differences.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Điểm khác biệt chính
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {analysis.differences.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-2.5"
              >
                <div className="px-2 py-1 rounded-lg bg-pink-100 border border-pink-200 text-[#ff5e97] font-mono font-bold text-xs shrink-0">
                  {d.type === 'different' ? `${d.from} → ${d.to}` : d.from}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">
                    {d.type === 'missing' ? 'Âm cuối bị thiếu' : 'Âm cần sửa'}
                  </p>
                  <p className="text-xs text-slate-600 leading-snug">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Cách sửa */}
      {analysis.fixTips.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Cách đặt khẩu hình miệng
          </div>
          <div className="space-y-2">
            {analysis.fixTips.map((tip, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-pink-50/30 border border-pink-100 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-pink-200 font-mono text-[#ff5e97] font-bold">
                    {tip.phoneme}
                  </span>
                  <span>{tip.nameVi}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pl-1">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Lời khuyên AI */}
      <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1 text-xs">
        <div className="font-bold text-[#ff5e97] text-xs uppercase tracking-wide">
          Lời khuyên từ ENjoy AI
        </div>
        <p className="text-slate-700 leading-relaxed">
          {renderFormattedAiText(analysis.aiAdvice)}
        </p>
      </div>

      {/* Kết quả sau khi thử */}
      {assessmentResult && (
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
            assessmentResult.isCorrect
              ? 'bg-pink-50 border-pink-200 text-[#ff5e97]'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span>{assessmentResult.message}</span>
          <span className="font-mono text-sm">{assessmentResult.score} điểm</span>
        </div>
      )}

      {/* 6. Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-pink-50">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onPlayWord}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs cursor-pointer border transition-all ${
              isPlaying
                ? 'bg-[#ff5e97] border-[#ff5e97] text-white'
                : 'bg-white hover:bg-pink-50 text-slate-700 border-pink-200'
            }`}
          >
            {isPlaying ? 'Đang phát...' : 'Nghe mẫu'}
          </button>

          <button
            onClick={onToggleRecord}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs cursor-pointer border transition-all ${
              isRecording
                ? 'bg-[#ff5e97] border-[#ff5e97] text-white animate-pulse'
                : 'bg-white hover:bg-pink-50 text-slate-700 border-pink-200'
            }`}
          >
            {isRecording ? 'Đang thu âm...' : 'Đọc thử'}
          </button>

          <button
            onClick={() => onOpenGuide(primaryFixPhoneme)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-slate-700 font-semibold text-xs cursor-pointer transition-all border border-pink-200"
          >
            Hướng dẫn đọc âm
          </button>
        </div>

        <button
          onClick={onStartPractice}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#ff5e97] hover:bg-[#e84c85] text-white font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
        >
          Luyện tập bài này
        </button>
      </div>

    </div>
  );
};
