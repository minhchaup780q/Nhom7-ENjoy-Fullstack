import { chatbotApi } from '../../learning/services/chatbotApi';
import type { VocabAiChallenge } from '../types';

/**
 * Danh sách 22 cấu trúc ngữ pháp Pre-A1 từ docs/grammar.text
 * và các mẫu câu tự nhiên, có nghĩa sâu sắc theo từng chủ đề & từ vựng.
 */

interface GrammarTemplateRule {
  grammarName: string;
  generate: (word: string, topic: string) => {
    sentence: string;
    correctAnswer: string;
    options: string[];
    translation: string;
    hint: string;
  };
}

const GRAMMAR_RULES: GrammarTemplateRule[] = [
  // 1. There is / There are (Đục lỗ cụm ngữ pháp There is / There are)
  {
    grammarName: 'There is / There are',
    generate: (word: string, topic: string) => {
      const isPlural = word.endsWith('s') || word === 'feet' || word === 'teeth' || word === 'mice' || word === 'children';
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      if (isPlural) {
        return {
          sentence: `Look! _____ two ${word} in the room.`,
          correctAnswer: 'There are',
          options: ['There are', 'There is', 'They is', 'It have'],
          translation: `Nhìn kìa! Có hai ${word} ở trong phòng.`,
          hint: `Vì danh từ "${word}" ở số nhiều nên bé hãy chọn "There are".`,
        };
      }
      return {
        sentence: `Look! _____ ${article} ${word} under the tree.`,
        correctAnswer: 'There is',
        options: ['There is', 'There are', 'They have', 'It are'],
        translation: `Nhìn kìa! Có một ${word} ở dưới cái cây.`,
        hint: `Vì chỉ có một ${word} (số ít) nên bé hãy chọn "There is".`,
      };
    },
  },

  // 2. Have got / Has got for possession (Đục lỗ have got / has got)
  {
    grammarName: 'Have (got) for possession',
    generate: (word: string, topic: string) => {
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      const isPlural = word.endsWith('s');
      if (Math.random() > 0.5) {
        return {
          sentence: `Lucy _____ ${isPlural ? 'some' : article} new ${word}.`,
          correctAnswer: 'has got',
          options: ['has got', 'have got', 'is got', 'having'],
          translation: `Lucy có ${isPlural ? 'một vài' : 'một'} ${word} mới.`,
          hint: `Chủ ngữ là "Lucy" (ngôi thứ 3 số ít) nên đi cùng "has got".`,
        };
      }
      return {
        sentence: `I _____ ${isPlural ? 'some' : article} lovely ${word}.`,
        correctAnswer: 'have got',
        options: ['have got', 'has got', 'am got', 'having got'],
        translation: `Tôi có ${isPlural ? 'một vài' : 'một'} ${word} đáng yêu.`,
        hint: `Chủ ngữ là "I" nên đi cùng cấu trúc "have got".`,
      };
    },
  },

  // 3. Like + V-ing (Đục lỗ động từ đuôi -ing hoặc like)
  {
    grammarName: 'Like + V-ing',
    generate: (word: string, topic: string) => {
      if (topic === 'Food & drink') {
        return {
          sentence: `My little brother _____ ${word} for breakfast.`,
          correctAnswer: 'likes eating',
          options: ['likes eating', 'like eat', 'is like eat', 'liking eat'],
          translation: `Em trai của tôi thích ăn ${word} vào bữa sáng.`,
          hint: `Sau "likes" động từ "eat" phải thêm đuôi -ing thành "eating".`,
        };
      }
      return {
        sentence: `The children _____ with their ${word}.`,
        correctAnswer: 'like playing',
        options: ['like playing', 'likes play', 'am playing', 'like to playing'],
        translation: `Các bạn nhỏ thích chơi đùa cùng ${word} của mình.`,
        hint: `Chủ ngữ "The children" (số nhiều) đi với "like playing".`,
      };
    },
  },

  // 4. Present continuous (Đục lỗ to be + V-ing)
  {
    grammarName: 'Present continuous',
    generate: (word: string, topic: string) => {
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      return {
        sentence: `The girl is _____ her ${word} right now.`,
        correctAnswer: 'drawing',
        options: ['drawing', 'draw', 'draws', 'drawed'],
        translation: `Cô bé đang vẽ ${word} của mình ngay lúc này.`,
        hint: `Cấu trúc thì hiện tại tiếp diễn: "is + V-ing" (drawing).`,
      };
    },
  },

  // 5. Would like (Đục lỗ Would like)
  {
    grammarName: 'Would like + noun',
    generate: (word: string, topic: string) => {
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      return {
        sentence: `_____ ${article} ${word}, please.`,
        correctAnswer: 'I would like',
        options: ['I would like', 'I am like', 'I like to', 'I can to'],
        translation: `Làm ơn cho tôi một ${word}.`,
        hint: `Cấu trúc đưa ra yêu cầu lịch sự: "I would like...".`,
      };
    },
  },

  // 6. Prepositions of place (Đục lỗ giới từ vị trí kết hợp từ vựng)
  {
    grammarName: 'Prepositions of place',
    generate: (word: string, topic: string) => {
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      return {
        sentence: `Please put the ${word} _____ the big table.`,
        correctAnswer: 'on',
        options: ['on', 'to', 'at', 'into of'],
        translation: `Làm ơn hãy đặt ${word} ở trên cái bàn lớn.`,
        hint: `Giới từ chỉ vị trí "ở trên bề mặt" là "on".`,
      };
    },
  },

  // 7. Determiners (This is / These are)
  {
    grammarName: 'Determiners (This is / These are)',
    generate: (word: string, topic: string) => {
      const isPlural = word.endsWith('s');
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      if (isPlural) {
        return {
          sentence: `_____ my favorite ${word}.`,
          correctAnswer: 'These are',
          options: ['These are', 'This is', 'That are', 'It is'],
          translation: `Đây là những ${word} yêu thích của tôi.`,
          hint: `Danh từ số nhiều "${word}" đi với "These are".`,
        };
      }
      return {
        sentence: `_____ ${article} beautiful ${word}.`,
        correctAnswer: 'This is',
        options: ['This is', 'These are', 'Those is', 'They are'],
        translation: `Đây là một ${word} thật đẹp.`,
        hint: `Chỉ một sự vật ở gần dùng "This is".`,
      };
    },
  },

  // 8. Can for ability / requests (Đục lỗ Can / Can I have)
  {
    grammarName: 'Can for ability / requests',
    generate: (word: string, topic: string) => {
      const article = /^[aeiou]/i.test(word) ? 'an' : 'a';
      return {
        sentence: `_____ some fresh ${word}?`,
        correctAnswer: 'Can I have',
        options: ['Can I have', 'Do I can have', 'Am I have', 'Can I to have'],
        translation: `Tôi có thể xin một ít ${word} tươi được không?`,
        hint: `Câu hỏi xin phép / yêu cầu lịch sự: "Can I have...?".`,
      };
    },
  },

  // 9. Let's + verb (Đục lỗ Let's + động từ)
  {
    grammarName: 'Let\'s + verb',
    generate: (word: string, topic: string) => {
      return {
        sentence: `_____ at the wonderful ${word}!`,
        correctAnswer: 'Let\'s look',
        options: ['Let\'s look', 'Let\'s looking', 'Let\'s to look', 'Let looking'],
        translation: `Chúng mình hãy cùng ngắm nhìn ${word} tuyệt vời này nào!`,
        hint: `Sau "Let's" luôn là động từ nguyên mẫu không chia: "Let's look".`,
      };
    },
  },

  // 10. What a + adj + noun (Đục lỗ cảm thán What a / What)
  {
    grammarName: 'What (a/an) + adj + noun',
    generate: (word: string, topic: string) => {
      const isPlural = word.endsWith('s');
      if (isPlural) {
        return {
          sentence: `_____ nice ${word}!`,
          correctAnswer: 'What',
          options: ['What', 'What a', 'How a', 'So a'],
          translation: `Những ${word} này thật là đẹp biết bao!`,
          hint: `Với danh từ số nhiều, câu cảm thán dùng "What + adj + noun" (không có a/an).`,
        };
      }
      return {
        sentence: `_____ cute ${word}!`,
        correctAnswer: 'What a',
        options: ['What a', 'What', 'How a', 'Such'],
        translation: `Thật là một ${word} đáng yêu!`,
        hint: `Với danh từ số ít đếm được, câu cảm thán dùng "What a + adj + noun".`,
      };
    },
  },
];

export const vocabGrammarChallengeService = {
  /**
   * Tạo câu hỏi ngữ pháp đục lỗ thông minh, có nghĩa chuẩn xác từ template logic
   */
  generateSmartLocalChallenge: (
    word: string,
    topic: string,
    userId: number = 0,
    avoidGrammarName?: string
  ): VocabAiChallenge => {
    const cleanWord = word.trim().toLowerCase();
    const availableRules = avoidGrammarName
      ? GRAMMAR_RULES.filter((r) => r.grammarName !== avoidGrammarName)
      : GRAMMAR_RULES;

    const chosenRule =
      availableRules[Math.floor(Math.random() * availableRules.length)] ||
      GRAMMAR_RULES[0];

    const generated = chosenRule.generate(cleanWord, topic);

    return {
      userId,
      word: cleanWord,
      topic,
      grammarName: chosenRule.grammarName,
      sentence: generated.sentence,
      correctAnswer: generated.correctAnswer,
      options: generated.options,
      translation: generated.translation,
      hint: generated.hint,
    };
  },

  /**
   * Gọi AI sinh câu hỏi ngữ pháp đục lỗ chi tiết, hoặc fallback về Smart Local Challenge
   */
  generateAiGrammarChallenge: async (
    userId: number,
    word: string,
    topic: string,
    currentChallengeGrammar?: string
  ): Promise<VocabAiChallenge> => {
    const cleanWord = word.trim().toLowerCase();

    const prompt = `Bạn là giáo viên tiếng Anh chuẩn Cambridge Pre-A1 Starters.
Nhiệm vụ: Tạo 1 câu ngắn có nghĩa tự nhiên, ngữ cảnh hoàn chỉnh kết hợp từ vựng "${cleanWord}" (chủ đề: "${topic}") và cấu trúc ngữ pháp Pre-A1.

YÊU CẦU BẮT BUỘC:
1. Chọn 1 trong các cấu trúc ngữ pháp Pre-A1 phù hợp nhất từ danh sách sau (Ưu tiên cấu trúc khác với "${currentChallengeGrammar || ''}"):
- There is / There are (Ví dụ: Look! _____ a cute dog in the yard.)
- Have (got) for possession (Ví dụ: She _____ a blue bag.)
- Like + V-ing (Ví dụ: I _____ with my cat.)
- Present continuous (Ví dụ: The girl is _____ her picture now.)
- Would like + noun (Ví dụ: _____ an apple, please.)
- Prepositions of place (Ví dụ: Put the book _____ the table.)
- Determiners (This is / These are) (Ví dụ: _____ my favorite books.)
- Can for ability / requests (Ví dụ: _____ a glass of water?)
- Let's + verb (Ví dụ: _____ at the monkeys!)
- What (a/an) + adj + noun (Ví dụ: _____ cute puppy!)

2. ĐỤC LỖ (FILL IN THE BLANK): Thay thế cụm ngữ pháp quan trọng hoặc cụm ngữ pháp + từ vựng bằng chỗ trống "_____".
3. LỰA CHỌN (OPTIONS): Cung cấp 4 phương án lựa chọn khác nhau (trong đó có 1 đáp án chính xác). Các phương án sai phải là các lỗi ngữ pháp hay gặp của trẻ em (ví dụ: chia sai to be, quên đuôi -ing, nhầm have/has).
4. DỊCH NGHĨA TIẾNG VIỆT: Cung cấp câu dịch tiếng Việt đầy đủ và tự nhiên cho toàn bộ câu.
5. GỢI Ý (HINT): 1 câu gợi ý ngắn gọn, dễ thương bằng tiếng Việt giúp bé nhận ra điểm ngữ pháp.

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ theo định dạng mẫu sau (không kèm markdown):
{
  "grammarName": "Tên cấu trúc ngữ pháp",
  "sentence": "Câu tiếng Anh có chỗ trống _____",
  "correctAnswer": "đáp án chính xác",
  "options": ["đáp án 1", "đáp án 2", "đáp án 3", "đáp án 4"],
  "translation": "Bản dịch tiếng Việt đầy đủ và tự nhiên của cả câu.",
  "hint": "Gợi ý ngữ pháp ngắn gọn cho bé."
}`;

    try {
      const aiResponse = await chatbotApi.ask(
        prompt,
        `Chủ đề: ${topic}, Từ vựng: ${cleanWord}`
      );

      const cleanJsonStr = aiResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const firstBrace = cleanJsonStr.indexOf('{');
      const lastBrace = cleanJsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonOnly = cleanJsonStr.substring(firstBrace, lastBrace + 1);
        const obj = JSON.parse(jsonOnly);
        if (
          obj.sentence &&
          obj.sentence.includes('_____') &&
          obj.correctAnswer &&
          Array.isArray(obj.options) &&
          obj.options.length >= 2
        ) {
          // Đảm bảo đáp án đúng luôn nằm trong options
          const opts: string[] = obj.options;
          if (!opts.some((o) => o.toLowerCase() === obj.correctAnswer.toLowerCase())) {
            opts[0] = obj.correctAnswer;
          }
          return {
            userId,
            word: cleanWord,
            topic,
            grammarName: obj.grammarName || 'Pre-A1 Grammar',
            sentence: obj.sentence,
            correctAnswer: obj.correctAnswer,
            options: opts,
            translation: obj.translation || `Câu luyện tập với từ ${cleanWord}`,
            hint: obj.hint || 'Bé hãy chú ý cấu trúc ngữ pháp để chọn đáp án đúng nhé!',
          };
        }
      }
    } catch (err) {
      console.warn('[GrammarChallengeService] Gọi AI gặp sự cố, sử dụng bộ sinh ngữ cảnh thông minh:', err);
    }

    // Fallback thông minh có nghĩa đầy đủ
    return vocabGrammarChallengeService.generateSmartLocalChallenge(
      cleanWord,
      topic,
      userId,
      currentChallengeGrammar
    );
  },
};
