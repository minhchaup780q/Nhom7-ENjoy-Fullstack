import { apiClient } from '../../../services/apiClient';
import { vocabGrammarChallengeService } from './vocabGrammarChallengeService';
import type { VocabStatsResponse, TopicWeakWordDetail, VocabAiChallenge } from '../types';

const VOCAB_STATS_BASE = '/api/vocab-stats';

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
    forceRegenerate: boolean = false,
    currentGrammarName?: string
  ): Promise<VocabAiChallenge> => {
    // 1. Kiểm tra cache DB trước nếu không ép sinh mới
    if (!forceRegenerate) {
      try {
        const cached = await vocabStatsApi.getSavedAiChallenge(userId, word, false);
        if (
          cached &&
          cached.sentence &&
          Array.isArray(cached.blanks) &&
          cached.blanks.length >= 2 &&
          (cached.sentence.includes('[____') || cached.sentence.includes('_____'))
        ) {
          console.log('[VocabStatsAPI] 🎯 Sử dụng câu hỏi ngữ pháp AI từ DB Cache:', cached);
          return cached;
        }
      } catch (err) {
        console.warn('[VocabStatsAPI] ⚠️ Không lấy được cache DB:', err);
      }
    }

    // 2. Tạo câu hỏi mới qua AI / Grammar Challenge Service
    const challenge = await vocabGrammarChallengeService.generateAiGrammarChallenge(
      userId,
      word,
      topic,
      currentGrammarName
    );

    // 3. Lưu câu hỏi mới vào DB để lần sau mở lại
    try {
      const saved = await vocabStatsApi.saveAiChallenge(challenge);
      if (saved && saved.id) {
        challenge.id = saved.id;
      }
    } catch (saveErr) {
      console.warn('[VocabStatsAPI] ⚠️ Không thể lưu AI challenge vào DB:', saveErr);
    }

    return challenge;
  },
};

