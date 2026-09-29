import React from 'react';
import { SpeakerWaveIcon, SparklesIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import { Button3D } from '../../../components/ui/Button3D';
import {
  resolvePronunciationAnalysis,
  type PronunciationAnalysisData,
} from '../../learning/services/pronunciationHelper';

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

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-pink-300 transition-all space-y-5 text-slate-800">
      
      {/* =================================================================== */}
      {/* 1. HEADER                                                           */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              {analysis.targetWord}
            </span>
            <button
              onClick={onPlayWord}
              aria-label={`Nghe phát âm từ ${analysis.targetWord}`}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                isPlaying
                  ? 'bg-pink-100 border-pink-300 text-pink-600 scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 hover:text-pink-600'
              }`}
            >
              <SpeakerWaveIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-mono font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
              {analysis.targetIPA}
            </span>
            <span className="text-slate-500 font-semibold">
              ({analysis.targetMeaning})
            </span>
          </div>
        </div>

        {/* Badge âm vị đầy đủ bên phải */}
        <div className="flex items-center gap-1 self-start sm:self-auto px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono font-bold">
          {analysis.phonemes.map((p, idx) => (
            <React.Fragment key={idx}>
              <span className={p.status !== 'match' ? 'text-pink-600 font-black' : 'text-slate-600'}>
                {p.target}
              </span>
              {idx < analysis.phonemes.length - 1 && <span className="text-slate-300">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. PHẦN SO SÁNH PHÁT ÂM - QUAN TRỌNG NHẤT (FOCAL POINT)             */}
      {/* =================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50/90 to-white border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Phân tích chi tiết từng âm vị</span>
          <span className="text-pink-600 lowercase font-medium">so sánh âm chuẩn vs bạn đọc</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="min-w-fit space-y-3">
            
            {/* Hàng 1: PHÁT ÂM ĐÚNG */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block w-fit mb-0.5">
                  Phát âm đúng
                </span>
                <span className="font-display font-bold text-sm text-slate-800">
                  {analysis.targetWord}
                </span>
              </div>

              {/* Danh sách Phonemes của Từ chuẩn */}
              <div className="flex items-center gap-2 flex-wrap">
                {analysis.phonemes.map((p, idx) => {
                  const isDiff = p.status === 'different';
                  const isMissing = p.status === 'missing';

                  return (
                    <div
                      key={idx}
                      className={`min-w-[42px] px-2.5 py-1.5 rounded-xl border text-center font-mono text-xs transition-all ${
                        isDiff
                          ? 'bg-pink-50 border-pink-300 text-pink-800 font-black shadow-2xs'
                          : isMissing
                          ? 'bg-pink-50/70 border-2 border-dashed border-pink-300 text-pink-700 font-black'
                          : 'bg-white border-slate-200 text-slate-700 font-bold'
                      }`}
                    >
                      <div className="text-[13px]">{p.target}</div>
                      <div className="text-[9px] font-sans font-bold text-slate-400 mt-0.5">
                        {isDiff ? 'cần sửa' : isMissing ? 'bị thiếu' : 'chuẩn'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hàng 2: BẠN ĐỌC */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-24 sm:w-28 shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 block w-fit mb-0.5">
                  Bạn đọc
                </span>
                <span className="font-display font-bold text-sm text-pink-600 line-through">
                  {analysis.userWord}
                </span>
              </div>

              {/* Danh sách Phonemes do Bạn đọc */}
              <div className="flex items-center gap-2 flex-wrap">
                {analysis.phonemes.map((p, idx) => {
                  const isDiff = p.status === 'different';
                  const isMissing = p.status === 'missing';

                  return (
                    <div
                      key={idx}
                      className={`min-w-[42px] px-2.5 py-1.5 rounded-xl border text-center font-mono text-xs transition-all ${
                        isDiff
                          ? 'bg-pink-100 border-pink-400 text-pink-900 font-black'
                          : isMissing
                          ? 'bg-slate-100/80 border border-dashed border-slate-300 text-slate-400 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 font-bold'
                      }`}
                    >
                      <div className="text-[13px]">
                        {p.user || '—'}
                      </div>
                      <div className="text-[9px] font-sans font-bold text-slate-400 mt-0.5">
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

      {/* =================================================================== */}
      {/* 3. HIỂN THỊ SỰ KHÁC BIỆT CHÍNH                                      */}
      {/* =================================================================== */}
      {analysis.differences.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider">
            Điểm khác biệt chính
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {analysis.differences.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-pink-50/50 border border-pink-200/80 flex items-start gap-2.5"
              >
                <div className="px-2 py-1 rounded-lg bg-pink-100 border border-pink-300 text-pink-700 font-mono font-black text-xs shrink-0">
                  {d.type === 'different' ? `${d.from} → ${d.to}` : d.from}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">
                    {d.type === 'missing' ? 'Âm cuối bị thiếu' : 'Âm cần sửa'}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. PHẦN GIẢI THÍCH CÁCH PHÁT ÂM (CÁCH SỬA)                          */}
      {/* =================================================================== */}
      {analysis.fixTips.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-display font-black text-slate-800 uppercase tracking-wider">
            Cách sửa khẩu hình
          </div>
          <div className="space-y-2">
            {analysis.fixTips.map((tip, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-pink-600 font-black">
                    {tip.phoneme}
                  </span>
                  <span>{tip.nameVi}</span>
                </div>
                <p className="text-slate-600 font-medium text-[11px] leading-relaxed pl-1">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. AI RECOMMENDATION (LỜI KHUYÊN TỪ ENJOY AI)                      */}
      {/* =================================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-pink-50/40 to-slate-50 border border-pink-200/80 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-display font-black text-pink-900 text-[11px] uppercase tracking-wide">
          <SparklesIcon className="w-3.5 h-3.5 text-pink-500" />
          <span>Lời khuyên từ ENjoy AI</span>
        </div>
        <p className="text-slate-700 font-medium leading-relaxed">
          {analysis.aiAdvice}
        </p>
      </div>

      {/* Kết quả sau khi bé luyện nói thử */}
      {assessmentResult && (
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold animate-in fade-in ${
            assessmentResult.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}
        >
          <span>{assessmentResult.message}</span>
          <span className="font-mono text-sm">{assessmentResult.score}đ</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. PRACTICE ACTIONS                                                 */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        
        {/* 3 Nút Hành Động Phụ */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onPlayWord}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer border transition-all shadow-2xs flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-pink-50 border-pink-300 text-pink-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <SpeakerWaveIcon className="w-3.5 h-3.5 text-pink-500" />
            Nghe
          </button>

          <button
            onClick={onToggleRecord}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer border transition-all shadow-2xs flex items-center gap-1.5 ${
              isRecording
                ? 'bg-pink-50 border-pink-400 text-pink-600 animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <MicrophoneIcon className="w-3.5 h-3.5 text-pink-500" />
            {isRecording ? 'Đang nghe...' : 'Luyện nói'}
          </button>

          <button
            onClick={() => onOpenGuide(primaryFixPhoneme)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all border border-slate-200 shadow-2xs"
          >
            Hướng dẫn đọc âm
          </button>
        </div>

        {/* 1 Primary CTA Nổi Bật Nhất */}
        <Button3D
          variant="pink"
          size="md"
          onClick={onStartPractice}
          className="w-full sm:w-auto px-6 text-xs font-display font-black tracking-wider"
        >
          LUYỆN TẬP
        </Button3D>
      </div>

    </div>
  );
};
