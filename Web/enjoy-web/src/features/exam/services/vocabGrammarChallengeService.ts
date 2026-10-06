import { chatbotApi } from '../../learning/services/chatbotApi';
import type { VocabAiChallenge, BlankDetail } from '../types';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Programmatic hole-punch: thay grammarPart và vocab trong fullSentence
 * bằng [____ 1 ____] và [____ 2 ____].
 * Trả về null nếu không tìm thấy hoặc 2 vùng chồng chéo.
 */
function punchHoles(
  fullSentence: string,
  grammarPart: string,
  vocabWord: string
): string | null {
  const lowerSentence = fullSentence.toLowerCase();
  const lowerGrammar = grammarPart.toLowerCase();

  // Tìm grammar part
  const gIdx = lowerSentence.indexOf(lowerGrammar);
  if (gIdx === -1) return null;

  // Tìm vocab (whole word, tránh trùng vùng grammar)
  const vocabRegex = new RegExp(`\\b${escapeRegex(vocabWord)}\\b`, 'gi');
  let vMatch: RegExpExecArray | null = null;
  let vIdx = -1;
  let vLen = vocabWord.length;

  while ((vMatch = vocabRegex.exec(fullSentence)) !== null) {
    const candidateStart = vMatch.index;
    const candidateEnd = candidateStart + vMatch[0].length;
    const grammarEnd = gIdx + grammarPart.length;
    if (candidateEnd <= gIdx || candidateStart >= grammarEnd) {
      vIdx = candidateStart;
      vLen = vMatch[0].length;
      break;
    }
  }

  if (vIdx === -1) {
    const lowerVocab = vocabWord.toLowerCase();
    let searchFrom = 0;
    while (true) {
      const idx = lowerSentence.indexOf(lowerVocab, searchFrom);
      if (idx === -1) return null;
      const candidateEnd = idx + vocabWord.length;
      const grammarEnd = gIdx + grammarPart.length;
      if (candidateEnd <= gIdx || idx >= grammarEnd) {
        vIdx = idx;
        break;
      }
      searchFrom = idx + 1;
    }
  }

  if (vIdx === -1) return null;

  // Sắp xếp 2 vùng
  type Hole = { label: string; start: number; end: number };
  const holes: Hole[] = [
    { label: '[____ 1 ____]', start: gIdx, end: gIdx + grammarPart.length },
    { label: '[____ 2 ____]', start: vIdx, end: vIdx + vLen },
  ].sort((a, b) => a.start - b.start);

  if (holes[0].end > holes[1].start) return null;

  let result = '';
  let cursor = 0;
  for (const hole of holes) {
    result += fullSentence.substring(cursor, hole.start);
    result += hole.label;
    cursor = hole.end;
  }
  result += fullSentence.substring(cursor);

  return result;
}

/**
 * Đảm bảo grammarOptions luôn có đáp án đúng + 3 sai, đủ 4 options.
 */
function ensureGrammarOptions(correctAnswer: string, aiOptions: string[]): string[] {
  const correctLower = correctAnswer.toLowerCase().trim();
  const uniqueMap = new Map<string, string>();
  uniqueMap.set(correctLower, correctAnswer);

  for (const opt of aiOptions) {
    const key = opt.toLowerCase().trim();
    if (key && key !== correctLower && !uniqueMap.has(key)) {
      uniqueMap.set(key, opt);
    }
    if (uniqueMap.size >= 4) break;
  }

  const fallback = ["don't", "can", "There is", "There are", "is", "are", "has got",
    "Let's", "would like", "What a", "in", "on", "under", "and", "like", "likes"];
  for (const f of fallback) {
    if (uniqueMap.size >= 4) break;
    if (!uniqueMap.has(f.toLowerCase())) uniqueMap.set(f.toLowerCase(), f);
  }

  return shuffleArray(Array.from(uniqueMap.values()).slice(0, 4));
}

/**
 * Đảm bảo vocabOptions luôn có đáp án đúng + 3 sai, đủ 4 options.
 */
function ensureVocabOptions(correctWord: string, aiOptions: string[]): string[] {
  const correctLower = correctWord.toLowerCase().trim();
  const uniqueMap = new Map<string, string>();
  uniqueMap.set(correctLower, correctWord);

  for (const opt of aiOptions) {
    const key = opt.toLowerCase().trim();
    if (key && key !== correctLower && !uniqueMap.has(key)) {
      uniqueMap.set(key, opt);
    }
    if (uniqueMap.size >= 4) break;
  }

  const fallback = ['apple', 'cat', 'dog', 'book', 'ball', 'tree', 'car', 'hat', 'pen', 'cup', 'sun', 'bed'];
  for (const f of fallback) {
    if (uniqueMap.size >= 4) break;
    if (!uniqueMap.has(f.toLowerCase())) uniqueMap.set(f.toLowerCase(), f);
  }

  return shuffleArray(Array.from(uniqueMap.values()).slice(0, 4));
}

export const vocabGrammarChallengeService = {
  /**
   * Sinh câu thử thách ngữ pháp 100% DYNAMIC bằng RAG + AI.
   *
   * FLOW:
   * 1. Frontend gửi {word, topic, avoidGrammarName} → Backend endpoint /grammar-challenge
   * 2. Backend query Qdrant Vector DB → lấy top-K ngữ pháp phù hợp nhất
   * 3. Backend inject context vào Ollama prompt → AI sinh câu đầy đủ
   * 4. Frontend nhận JSON → programmatic hole-punch → hiển thị
   *
   * → KHÔNG gửi grammar docs từ frontend nữa!
   */
  generateAiGrammarChallenge: async (
    userId: number,
    word: string,
    topic: string,
    avoidGrammarName?: string
  ): Promise<VocabAiChallenge> => {
    const cleanWord = word.trim().toLowerCase();

    console.log(`[AI Challenge RAG] 🧠 Từ: "${cleanWord}", Chủ đề: "${topic}"`);

    try {
      // Gọi endpoint RAG backend — chỉ gửi word + topic, nhẹ nhàng!
      const aiResponse = await chatbotApi.grammarChallenge(cleanWord, topic, avoidGrammarName);
      console.log('[AI Challenge RAG] 📥 Backend RAG phản hồi:', aiResponse);

      // Parse JSON
      const cleanStr = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanStr.indexOf('{');
      const lastBrace = cleanStr.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const obj = JSON.parse(cleanStr.substring(firstBrace, lastBrace + 1));

        const fullSentence: string = (obj.fullSentence || '').trim();
        const grammarPart: string = (obj.grammarPart || '').trim();
        const grammarName: string = (obj.grammarName || '').trim();
        let translation: string = (obj.translation || '').trim();
        let hint: string = (obj.hint || '').trim();

        // Lọc ký tự ngoại lai
        if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(translation)) {
          translation = `Câu sử dụng cấu trúc "${grammarName}" với từ "${cleanWord}".`;
        }
        if (/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(hint)) {
          hint = `Bé chọn đúng ngữ pháp và từ "${cleanWord}" nhé!`;
        }

        // Validate: câu phải chứa cả grammarPart và cleanWord
        if (
          fullSentence.length > 0 &&
          grammarPart.length > 0 &&
          fullSentence.toLowerCase().includes(grammarPart.toLowerCase()) &&
          fullSentence.toLowerCase().includes(cleanWord)
        ) {
          // Hole-punch programmatic
          const punchedSentence = punchHoles(fullSentence, grammarPart, cleanWord);

          if (
            punchedSentence &&
            punchedSentence.includes('[____ 1 ____]') &&
            punchedSentence.includes('[____ 2 ____]')
          ) {
            const gIdx = fullSentence.toLowerCase().indexOf(grammarPart.toLowerCase());
            const exactGrammarPart = fullSentence.substring(gIdx, gIdx + grammarPart.length);

            const grammarWrong: string[] = Array.isArray(obj.grammarWrong) ? obj.grammarWrong.map(String) : [];
            const vocabWrong: string[] = Array.isArray(obj.vocabWrong) ? obj.vocabWrong.map(String) : [];

            const grammarOptions = ensureGrammarOptions(exactGrammarPart, grammarWrong);
            const vocabOptions = ensureVocabOptions(cleanWord, vocabWrong);

            const blanks: BlankDetail[] = [
              {
                blankIndex: 1,
                label: 'Ngữ pháp',
                type: 'grammar',
                correctAnswer: exactGrammarPart,
                options: grammarOptions,
              },
              {
                blankIndex: 2,
                label: 'Từ vựng cần ôn',
                type: 'vocab',
                correctAnswer: cleanWord,
                options: vocabOptions,
              },
            ];

            const result: VocabAiChallenge = {
              userId,
              word: cleanWord,
              topic,
              grammarName: grammarName || 'Grammar',
              sentence: punchedSentence,
              blanks,
              correctAnswer: `${exactGrammarPart} | ${cleanWord}`,
              translation: translation || `Câu dùng cấu trúc "${grammarName}" với từ "${cleanWord}".`,
              hint: hint || `Bé chọn đúng ngữ pháp và từ "${cleanWord}" nhé!`,
            };

            console.log('[AI Challenge RAG] ✅ Thành công:', result.sentence);
            return result;
          }
        }
      }
    } catch (err) {
      console.error('[AI Challenge RAG] ❌ Lỗi:', err);
    }

    // ──────────────────────────────────────────────
    // FALLBACK: Câu cố định an toàn cuối cùng
    // ──────────────────────────────────────────────
    console.log('[AI Challenge RAG] 🛟 Fallback...');
    const article = /^[aeiou]/i.test(cleanWord) ? 'an' : 'a';
    return {
      userId,
      word: cleanWord,
      topic,
      grammarName: 'There is / There are',
      sentence: `[____ 1 ____] ${article} nice [____ 2 ____] in the room.`,
      blanks: [
        {
          blankIndex: 1, label: 'Ngữ pháp', type: 'grammar',
          correctAnswer: 'There is',
          options: shuffleArray(['There is', 'There are', 'It is', 'They are']),
        },
        {
          blankIndex: 2, label: 'Từ vựng cần ôn', type: 'vocab',
          correctAnswer: cleanWord,
          options: shuffleArray([cleanWord, 'book', 'table', 'chair']),
        },
      ],
      correctAnswer: `There is | ${cleanWord}`,
      translation: `Có ${article === 'an' ? 'một' : 'một cái'} ${cleanWord} đẹp trong phòng.`,
      hint: `Bé hãy chọn "There is" và từ "${cleanWord}" nhé!`,
    };
  },
};
