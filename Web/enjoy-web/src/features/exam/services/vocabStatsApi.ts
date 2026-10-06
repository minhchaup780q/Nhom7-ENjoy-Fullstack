import { apiClient } from '../../../services/apiClient';
import { chatbotApi } from '../../learning/services/chatbotApi';
import type { VocabStatsResponse, TopicWeakWordDetail, VocabAiChallenge } from '../types';

const VOCAB_STATS_BASE = '/api/vocab-stats';

// Danh sách các cấu trúc ngữ pháp Pre-A1 từ docs/grammar.text
const PRE_A1_GRAMMAR_RULES = [
  { name: 'There is / There are', pattern: 'There is a/an [WORD] in the garden.' },
  { name: 'Have (got) for possession', pattern: 'I have got a [WORD].' },
  { name: 'Like + V-ing', pattern: 'I like seeing a [WORD].' },
  { name: 'Can for ability', pattern: 'A [WORD] can jump high.' },
  { name: 'Present continuous', pattern: 'Look! The [WORD] is sleeping now.' },
  { name: 'Determiners (This/These/It)', pattern: 'This is a lovely [WORD].' },
  { name: 'Prepositions of place', pattern: 'The [WORD] is next to the table.' },
  { name: 'Adjectives', pattern: 'He has a beautiful [WORD].' },
  { name: 'Would like', pattern: 'I would like a [WORD], please.' },
  { name: 'Let\'s', pattern: 'Let\'s draw a [WORD] together!' },
  { name: 'What a + adj + noun', pattern: 'What a cute [WORD]!' },
];

export const vocabStatsApi = {
  /** Lấy thống kê từ vựng của user theo từng topic */
  getVocabStats: (userId: number): Promise<VocabStatsResponse> =>
    apiClient.get<VocabStatsResponse>(`${VOCAB_STATS_BASE}`, { params: { userId } }),

  /** Lấy danh sách từ yếu của topic kèm metadata chi tiết */
  getTopicWeakWords: (userId: number, topic: string): Promise<TopicWeakWordDetail[]> =>
    apiClient.get<TopicWeakWordDetail[]>(`${VOCAB_STATS_BASE}/topic-words`, { params: { userId, topic } }),

  /** Đánh dấu hoàn thành 1 từ vựng sau khi làm xong 4 vòng luyện tập */
  completeWord: (userId: number, word: string, topic?: string): Promise<{ success: boolean; word: string; message: string }> =>
    apiClient.put(`${VOCAB_STATS_BASE}/complete-word`, { userId, word, topic }),

  /** Lấy câu hỏi ngữ pháp AI đã lưu trong DB (force=false) */
  getSavedAiChallenge: (userId: number, word: string, force: boolean = false): Promise<VocabAiChallenge | null> =>
    apiClient.get<VocabAiChallenge | null>(`${VOCAB_STATS_BASE}/ai-challenge`, { params: { userId, word, force } }),

  /** Lưu câu hỏi ngữ pháp AI vào DB để tái sử dụng */
  saveAiChallenge: (challenge: VocabAiChallenge): Promise<VocabAiChallenge> =>
    apiClient.post<VocabAiChallenge>(`${VOCAB_STATS_BASE}/ai-challenge`, challenge),

  /**
   * Sinh câu hỏi ngữ pháp đục lỗ thông minh bằng AI từ từ vựng + topic + grammar.text.
   * Nếu có trong DB và force=false -> lấy từ DB.
   * Nếu force=true hoặc chưa có -> gọi AI sinh mới rồi lưu vào DB.
   */
  getOrGenerateAiChallenge: async (
    userId: number,
    word: string,
    topic: string,
    forceRegenerate: boolean = false
  ): Promise<VocabAiChallenge> => {
    // 1. Kiểm tra cache DB trước nếu không ép sinh mới
    if (!forceRegenerate) {
      try {
        const cached = await vocabStatsApi.getSavedAiChallenge(userId, word, false);
        if (cached && cached.sentence && cached.correctAnswer) {
          console.log('[VocabStatsAPI] 🎯 Sử dụng câu hỏi ngữ pháp AI từ DB Cache:', cached);
          return cached;
        }
      } catch (err) {
        console.warn('[VocabStatsAPI] ⚠️ Không lấy được cache DB:', err);
      }
    }

    // 2. Gọi AI sinh câu mới
    const grammarPrompt = `Bạn là chuyên gia sư phạm tiếng Anh cho trẻ em Pre-A1 (Starters).
Nhiệm vụ: Tạo một câu ngắn đục lỗ (Fill-in-the-blank) cho trẻ 6-10 tuổi luyện tập từ vựng "${word}" thuộc chủ đề "${topic}".

Quy tắc bắt buộc:
1. Hãy chọn 1 trong các cấu trúc ngữ pháp Pre-A1 phù hợp nhất từ danh sách sau:
- Nouns / Adjectives (e.g. He is a small boy. This is an apple.)
- Determiners (This is a [word] / Put the [word] on the table.)
- Present simple (I like [word] / Pat has a [word].)
- Present continuous (The [word] is playing.)
- Can for ability/requests (A [word] can run. / Can I have a [word]?)
- Have (got) (I have got a [word].)
- Prepositions of place (The [word] is on/under/next to the table.)
- There is / There are (There is a [word] in the room.)
- Would like (I would like a [word].)
- Let's (Let's look at the [word]!)
- What (a/an) + adj + n (What a cute [word]!)

2. Câu phải ngắn gọn (dưới 8 từ), dễ thương, chuẩn ngữ pháp Pre-A1.
3. Trong câu, hãy thay từ "${word}" bằng chỗ trống "_____".
4. Cung cấp 4 lựa chọn (options) trong đó 1 lựa chọn là "${word}", và 3 lựa chọn còn lại là các từ tiếng Anh quen thuộc khác nhưng KHÔNG trùng.
5. Cung cấp bản dịch tiếng Việt dễ hiểu của câu hoàn chỉnh.

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ theo format mẫu sau (không kèm markdown code fence nếu có thể, hoặc bọc trong json):
{
  "grammarName": "There is / There are",
  "sentence": "There is a _____ in the garden.",
  "correctAnswer": "${word.toLowerCase()}",
  "options": ["${word.toLowerCase()}", "book", "car", "apple"],
  "translation": "Có một ... ở trong vườn.",
  "hint": "Gợi ý ngắn gọn bằng tiếng Việt giúp bé chọn đúng từ"
}`;

    let aiResultText = '';
    try {
      aiResultText = await chatbotApi.ask(grammarPrompt, `Chủ đề: ${topic}, Từ vựng mục tiêu: ${word}`);
    } catch (e) {
      console.warn('[VocabStatsAPI] ⚠️ Gọi AI thất bại, sẽ dùng fallback thông minh:', e);
    }

    // 3. Parse JSON từ AI response
    let parsedChallenge: VocabAiChallenge | null = null;
    try {
      const cleanJsonStr = aiResultText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const firstBrace = cleanJsonStr.indexOf('{');
      const lastBrace = cleanJsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonOnly = cleanJsonStr.substring(firstBrace, lastBrace + 1);
        const obj = JSON.parse(jsonOnly);
        if (obj.sentence && obj.correctAnswer) {
          parsedChallenge = {
            userId,
            word: word.toLowerCase(),
            topic,
            grammarName: obj.grammarName || 'Pre-A1 Grammar',
            sentence: obj.sentence,
            options: Array.isArray(obj.options) && obj.options.length >= 2 ? obj.options : [word.toLowerCase(), 'banana', 'pencil', 'chair'],
            correctAnswer: obj.correctAnswer || word.toLowerCase(),
            translation: obj.translation || `Câu luyện tập với từ ${word}`,
            hint: obj.hint || `Bé hãy chọn từ "${word}" để điền vào chỗ trống nhé!`,
          };
        }
      }
    } catch (parseErr) {
      console.warn('[VocabStatsAPI] ⚠️ Không parse được JSON từ AI, sử dụng fallback thông minh:', parseErr);
    }

    // 4. Fallback thông minh nếu AI không trả JSON chuẩn
    if (!parsedChallenge) {
      const randomRule = PRE_A1_GRAMMAR_RULES[Math.floor(Math.random() * PRE_A1_GRAMMAR_RULES.length)];
      const sampleSentence = randomRule.pattern.replace('[WORD]', '_____');
      parsedChallenge = {
        userId,
        word: word.toLowerCase(),
        topic,
        grammarName: randomRule.name,
        sentence: sampleSentence,
        options: [word.toLowerCase(), 'apple', 'ball', 'water'].sort(() => Math.random() - 0.5),
        correctAnswer: word.toLowerCase(),
        translation: `Đây là câu luyện tập với từ ${word} theo cấu trúc ${randomRule.name}.`,
        hint: `Bé hãy chọn từ "${word}" để hoàn thành câu nhé!`,
      };
    }

    // 5. Lưu kết quả mới vào DB
    try {
      const saved = await vocabStatsApi.saveAiChallenge(parsedChallenge);
      if (saved && saved.id) {
        parsedChallenge.id = saved.id;
      }
    } catch (saveErr) {
      console.warn('[VocabStatsAPI] ⚠️ Không thể lưu AI challenge vào DB:', saveErr);
    }

    return parsedChallenge;
  },
};

