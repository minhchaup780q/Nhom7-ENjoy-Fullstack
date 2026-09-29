import { VOWELS_DATA, CONSONANTS_DATA, type PhoneticItem } from '../../pronunciation/components/PronunciationGuidePage';

export interface PhonemeDiffItem {
  target: string;
  user: string | null;
  status: 'match' | 'different' | 'missing' | 'extra';
}

export interface PhonemeDifference {
  from: string;
  to?: string;
  description: string;
  type: 'different' | 'missing' | 'extra';
}

export interface PhonemeFixTip {
  phoneme: string;
  nameVi: string;
  tip: string;
  soundText?: string;
}

export interface PronunciationAnalysisData {
  targetWord: string;
  targetIPA: string;
  targetMeaning: string;
  userWord: string;
  userIPA: string;
  phonemes: PhonemeDiffItem[];
  differences: PhonemeDifference[];
  fixTips: PhonemeFixTip[];
  aiAdvice: string;
  primaryPhoneme?: string;
  phoneticGuideItem?: PhoneticItem;
}

// Tìm PhoneticItem trong VOWELS_DATA / CONSONANTS_DATA từ tab phát âm
export function findGuidePhoneticItem(phonemeSymbol: string): PhoneticItem | undefined {
  if (!phonemeSymbol) return undefined;
  const cleanSymbol = phonemeSymbol.replace(/[\/ˈˌ.]/g, '').trim();
  const all = [...VOWELS_DATA, ...CONSONANTS_DATA];

  // Khớp chính xác
  let found = all.find((p) => p.symbol === cleanSymbol);
  if (found) return found;

  // Khớp gần đúng (tiền tố hoặc hậu tố)
  found = all.find((p) => cleanSymbol.includes(p.symbol) || p.symbol.includes(cleanSymbol));
  return found;
}

// Hàm chuẩn hóa dữ liệu AI trả về hoặc tự động phân rã động cho câu/từ bất kỳ
export function resolvePronunciationAnalysis(
  targetWord: string,
  userWord: string,
  customMeaning?: string,
  cachedJson?: string | null
): PronunciationAnalysisData {
  const cleanTarget = (targetWord || '').trim();
  const cleanUser = (userWord || '').trim();
  const meaning = customMeaning || 'Từ vựng / Câu luyện tập';

  // 1. Ưu tiên đọc dữ liệu AI thông minh từ CSDL cache (hoàn toàn động từ AI LLM)
  if (cachedJson && cachedJson.length > 10) {
    try {
      const parsed = typeof cachedJson === 'string' ? JSON.parse(cachedJson) : cachedJson;
      if (parsed && (parsed.phonemes || parsed.targetIPA)) {
        return {
          targetWord: parsed.targetWord || cleanTarget,
          targetIPA: parsed.targetIPA || `/${cleanTarget}/`,
          targetMeaning: parsed.targetMeaning || meaning,
          userWord: parsed.userWord || cleanUser || 'Chưa đọc',
          userIPA: parsed.userIPA || (cleanUser ? `/${cleanUser}/` : '—'),
          phonemes: Array.isArray(parsed.phonemes) && parsed.phonemes.length > 0
            ? parsed.phonemes
            : buildDynamicPhonemes(cleanTarget, cleanUser),
          differences: Array.isArray(parsed.differences)
            ? parsed.differences
            : [],
          fixTips: Array.isArray(parsed.fixTips)
            ? parsed.fixTips
            : [],
          aiAdvice: parsed.aiAdvice || parsed.aiAnalysisVi || `Bé hãy chú ý luyện phát âm chuẩn từ "${cleanTarget}".`,
          primaryPhoneme: parsed.focusPhoneme || parsed.primaryPhoneme || 's',
          phoneticGuideItem: findGuidePhoneticItem(parsed.focusPhoneme || parsed.primaryPhoneme || 's'),
        };
      }
    } catch {
      // Parse lỗi thì chuyển sang xử lý động
    }
  }

  // 2. Xử lý động tức thì (Zero Hardcode) cho bất kỳ từ/câu/đoạn văn nào khi chưa có cache AI
  const phonemes = buildDynamicPhonemes(cleanTarget, cleanUser);
  const differences: PhonemeDifference[] = [];
  const fixTips: PhonemeFixTip[] = [];

  phonemes.forEach((p) => {
    if (p.status === 'different') {
      differences.push({
        from: p.target,
        to: p.user || undefined,
        description: `Âm ${p.target} của "${cleanTarget}" bị đọc thành ${p.user || 'khác'}.`,
        type: 'different',
      });
      fixTips.push({
        phoneme: p.target,
        nameVi: `Âm ${p.target}`,
        tip: `Đặt khẩu hình miệng chuẩn xác và phát âm rõ âm ${p.target}.`,
        soundText: p.target.replace(/[\/]/g, ''),
      });
    } else if (p.status === 'missing') {
      differences.push({
        from: p.target,
        description: `Âm ${p.target} bị thiếu ở cuối.`,
        type: 'missing',
      });
      fixTips.push({
        phoneme: p.target,
        nameVi: `Âm ${p.target}`,
        tip: `Giữ hơi và đọc rõ âm ${p.target} ở cuối từ, không nuốt âm.`,
        soundText: p.target.replace(/[\/]/g, ''),
      });
    }
  });

  const primaryDiff = differences[0];
  const primaryPhoneme = primaryDiff ? primaryDiff.from.replace(/[\/]/g, '') : 's';

  return {
    targetWord: cleanTarget,
    targetIPA: `/${cleanTarget}/`,
    targetMeaning: meaning,
    userWord: cleanUser || 'Chưa đọc',
    userIPA: cleanUser ? `/${cleanUser}/` : '—',
    phonemes,
    differences,
    fixTips,
    aiAdvice: differences.length > 0
      ? `AI đang phân tích chi tiết phát âm cho "${cleanTarget}". Bé hãy bấm Hướng dẫn đọc âm để xem chi tiết nhé!`
      : `Bé phát âm rất tốt "${cleanTarget}". Hãy tiếp tục luyện tập nhé!`,
    primaryPhoneme,
    phoneticGuideItem: findGuidePhoneticItem(primaryPhoneme),
  };
}

// Hàm phân rã và so sánh chuỗi âm/từ động hoàn toàn (không fix cứng từ vựng)
function buildDynamicPhonemes(target: string, user: string): PhonemeDiffItem[] {
  const tTokens = tokenizeText(target);
  const uTokens = tokenizeText(user);

  const result: PhonemeDiffItem[] = [];
  const maxLen = Math.max(tTokens.length, uTokens.length);

  for (let i = 0; i < maxLen; i++) {
    const t = tTokens[i] || null;
    const u = uTokens[i] || null;

    if (t && u) {
      if (t.toLowerCase() === u.toLowerCase()) {
        result.push({ target: `/${t}/`, user: `/${u}/`, status: 'match' });
      } else {
        result.push({ target: `/${t}/`, user: `/${u}/`, status: 'different' });
      }
    } else if (t && !u) {
      result.push({ target: `/${t}/`, user: null, status: 'missing' });
    } else if (!t && u) {
      result.push({ target: '—', user: `/${u}/`, status: 'extra' });
    }
  }

  return result.length > 0 ? result : [{ target: `/${target}/`, user: user ? `/${user}/` : null, status: 'match' }];
}

// Bóc tách từ hoặc câu thành mảng âm/ký tự/từ ngữ động
function tokenizeText(text: string): string[] {
  const clean = (text || '').replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
  if (!clean) return [];

  // Nếu là câu dài có nhiều từ (khoảng trắng)
  if (clean.includes(' ')) {
    return clean.split(/\s+/);
  }

  // Nếu là từ đơn, phân rã các cụm âm thanh phổ biến
  const chars = clean.split('');
  const tokens: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const next = chars[i + 1];
    if (c === 't' && next === 'h') {
      tokens.push('th');
      i++;
    } else if (c === 's' && next === 'h') {
      tokens.push('sh');
      i++;
    } else if (c === 'c' && next === 'h') {
      tokens.push('ch');
      i++;
    } else if (c === 'e' && next === 'e') {
      tokens.push('ee');
      i++;
    } else if (c === 'o' && next === 'o') {
      tokens.push('oo');
      i++;
    } else {
      tokens.push(c);
    }
  }
  return tokens;
}
