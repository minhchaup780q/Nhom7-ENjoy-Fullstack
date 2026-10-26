import { chatbotApi } from '../../learning/services/chatbotApi';
import { vocabStatsApi } from '../../exam/services/vocabStatsApi';
import type { TopicWeakWordDetail } from '../../exam/types';

export interface ReadingBlank {
  position: number;
  answer: string;
  hint?: string;
}

export interface ReadingExerciseData {
  pageIndex: number;
  topic: string;
  words: TopicWeakWordDetail[];
  title: string;
  fullStory: string;
  blankStory: string;
  blanks: ReadingBlank[];
  vietnameseTranslation?: string;
}

export interface ListeningQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ListeningDialogueLine {
  speaker: string;
  text: string;
}

export interface ListeningExerciseData {
  pageIndex: number;
  topic: string;
  words: TopicWeakWordDetail[];
  dialogue: ListeningDialogueLine[];
  fullTranscript: string;
  questions: ListeningQuestion[];
}

export interface TopicPersonalizedBatch {
  topic: string;
  readingExercises: ReadingExerciseData[];
  listeningExercises: ListeningExerciseData[];
}

export const getWordImageUrl = (word: string, customImage?: string | null): string => {
  const cleanImg = (customImage || '').trim();
  if (cleanImg && !cleanImg.includes('1516467508483-a7212febe31a')) {
    return cleanImg;
  }
  console.warn(`[PersonalizedPractice] Từ vựng "${word}" chưa có ảnh trong CSDL.`);
  return '';
};

/**
 * Trích xuất JSON an toàn từ phản hồi văn bản của AI
 */
function extractJsonFromAiReply<T>(reply: string): T | null {
  if (!reply) return null;
  try {
    const trimmed = reply.trim();
    // Bỏ markdown fences nếu AI vô tình thêm ```json ... ```
    const cleaned = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = reply.indexOf('{');
    const lastBrace = reply.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sub = reply.substring(firstBrace, lastBrace + 1);
        return JSON.parse(sub) as T;
      } catch (err) {
        console.warn('[PersonalizedPracticeService] Không parse được JSON:', err);
      }
    }
  }
  return null;
}

export const getWordTranslation = (word: string, customTranslation?: string | null): string => {
  if (
    customTranslation &&
    customTranslation.trim().length > 0 &&
    customTranslation.trim().toLowerCase() !== word.trim().toLowerCase()
  ) {
    return customTranslation.trim();
  }
  return word;
};

export const personalizedPracticeService = {
  /**
   * Lấy danh sách từ vựng cần cải thiện của user theo topic hoặc ALL (CHỈ DỮ LIỆU THẬT TỪ CSDL)
   */
  loadWeakWords: async (userId: number, topicName: string): Promise<TopicWeakWordDetail[]> => {
    try {
      const isAll = !topicName || topicName === 'ALL' || topicName === 'Tất cả' || topicName === 'Tất cả các chủ đề';
      const words = await vocabStatsApi.getTopicWeakWords(userId, isAll ? 'ALL' : topicName);
      // Sử dụng 100% hình ảnh và nghĩa từ CSDL
      return (words || []).map((w) => ({
        ...w,
        imageUrl: getWordImageUrl(w.word, w.imageUrl),
        meaning: getWordTranslation(w.word, w.translation),
      }));
    } catch (err) {
      console.error('[PersonalizedPracticeService] Lỗi khi tải từ yếu của bài thi:', err);
      return [];
    }
  },

  /**
   * Gom từ vựng theo từng topic và chia mỗi topic thành các trang từ 2 đến 4 từ
   */
  chunkWordsIntoPages: (words: TopicWeakWordDetail[]): TopicWeakWordDetail[][] => {
    if (!words || words.length === 0) return [];

    // 1. Nhóm từ theo topic
    const topicMap: Record<string, TopicWeakWordDetail[]> = {};
    for (const w of words) {
      const t = w.topic || 'Chung';
      if (!topicMap[t]) topicMap[t] = [];
      topicMap[t].push(w);
    }

    const allPages: TopicWeakWordDetail[][] = [];

    // 2. Chia mỗi topic thành các trang từ 2 đến 4 từ
    for (const [, topicWords] of Object.entries(topicMap)) {
      let i = 0;
      while (i < topicWords.length) {
        const remaining = topicWords.length - i;
        let chunkSize = 4;
        if (remaining <= 4) {
          chunkSize = remaining;
        } else if (remaining === 5) {
          chunkSize = 3;
        }
        allPages.push(topicWords.slice(i, i + chunkSize));
        i += chunkSize;
      }
    }

    return allPages;
  },

  /**
   * VÒNG ĐỌC: Gọi AI chatbot sinh câu chuyện đục lỗ theo phong cách Cambridge Reading Part 4
   * RÀNG BUỘC TUYỆT ĐỐI: Số ô đục lỗ (blanks) PHẢI BẰNG CHÍNH XÁC số lượng từ vựng words.length (2 từ = đúng 2 lỗ).
   */
  generateReadingExercise: async (
    pageIndex: number,
    topic: string,
    words: TopicWeakWordDetail[]
  ): Promise<ReadingExerciseData> => {
    const wordCount = words.length;
    const wordList = words.map((w) => w.word);
    const wordListStr = wordList.join(', ');

    const prompt = `You are an expert Cambridge English: Starters (Pre-A1) test creator.
Write a simple, charming, and highly logical children's story for the topic "${topic}".
The story MUST naturally and meaningfully use ALL of these target words: [${wordListStr}].
Target audience: 6-8 year old young learners (Pre-A1).

CRITICAL CONTEXT & CLUE RULES (MAKE IT 100% CLEAR AND LOGICAL):
Every target word MUST have a clear, specific, and unambiguous reason for being used in its sentence:
- If the words are colors (e.g. red, yellow, brown):
  * State the object being described with that specific color, or explain why that specific color is chosen (e.g., "The sweet apple on the tree was red.", "The warm sun was bright yellow.", "The little puppy had soft brown fur.").
  * DO NOT leave a color blank floating without the noun it describes!
- If the words are vehicles or transport (e.g. train, lorry, helicopter, swim):
  * "train": travels on the long railway tracks with carriages.
  * "lorry / truck": carries heavy goods and boxes on the road.
  * "helicopter": flies in the air with rotating blades/propellers.
  * "swim": jumping into the cool water to splash and swim.
- If the words are animals, school items, clothes, food, or home items:
  * Give a vivid, unmistakable sensory or functional detail (what it does, where it lives, what sound it makes, or how it is used).

FORMATTING REQUIREMENTS:
1. "title": A catchy, simple title for the story.
2. "fullStory": A complete, natural story of 3-5 sentences containing all target words: [${wordListStr}]. Write plain English without any blanks, brackets, or numbers.
3. Keep sentences short, fun, grammatically correct, and easy for kids to understand.

Return ONLY raw JSON with NO markdown formatting:
{
  "title": "A Day of Beautiful Colours",
  "fullStory": "The complete natural story containing all target words with rich context..."
}`;

    let parsedFullStory = '';
    let parsedTitle = `Chủ đề: ${topic}`;

    try {
      const reply = await chatbotApi.ask(prompt);
      const parsed = extractJsonFromAiReply<{
        title: string;
        fullStory: string;
      }>(reply);

      if (parsed) {
        parsedTitle = parsed.title || parsedTitle;
        parsedFullStory = parsed.fullStory || '';
      }
    } catch (err) {
      console.warn('[PersonalizedPracticeService] AI generate Reading failed, fallback:', err);
    }

    // Nếu AI không trả về fullStory hợp lệ, tạo câu chuyện mẫu ngữ cảnh chuẩn
    if (!parsedFullStory) {
      parsedFullStory = words.map((w) => `We can see a clear ${w.word} in our ${topic} lesson today.`).join(' ');
    }

    // ── XÂY DỰNG blankStory VÀ blanks ĐẢM BẢO CHÍNH XÁC words.length LỖ ĐỤC ──
    const strictBlanks: ReadingBlank[] = words.map((w, idx) => ({
      position: idx + 1,
      answer: w.word,
    }));

    // 1. Làm sạch toàn bộ các dấu ngoặc dư thừa, số thứ tự cũ nếu AI vô tình trả về
    let cleanStory = (parsedFullStory || '')
      .replace(/\(\d+\)\s*(?:\[[^\]]*\])?/g, ' ')
      .replace(/\[\s*([\w\s]+?)\s*\]/g, '$1')
      .replace(/\(\s*\)/g, ' ')
      .replace(/\[\s*\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 2. Thay thế chính xác từng target word thành token duy nhất __SLOT_1__, __SLOT_2__...
    for (let i = 0; i < words.length; i++) {
      const target = words[i].word.trim();
      const regex = new RegExp(`\\b${target}(?:s|es)?\\b`, 'i');
      if (regex.test(cleanStory)) {
        cleanStory = cleanStory.replace(regex, `__SLOT_${i + 1}__`);
      } else {
        cleanStory += ` Look at the beautiful __SLOT_${i + 1}__!`;
      }
    }

    return {
      pageIndex,
      topic,
      words,
      title: parsedTitle,
      fullStory: parsedFullStory,
      blankStory: cleanStory,
      blanks: strictBlanks,
    };
  },

  /**
   * VÒNG NGHE: Gọi AI chatbot sinh đoạn hội thoại gồm ĐÚNG 6 CÂU TỔNG CỘNG (3 lượt Tom, 3 lượt Lucy)
   * và các câu hỏi trắc nghiệm A, B, C, D cho từng từ vựng
   */
  generateListeningExercise: async (
    pageIndex: number,
    topic: string,
    words: TopicWeakWordDetail[]
  ): Promise<ListeningExerciseData> => {
    const wordList = words.map((w) => w.word);
    const wordListStr = wordList.join(', ');

    const prompt = `You are an expert Cambridge English: Starters (Pre-A1) test creator.
Create a short, natural listening conversation between two children, Tom and Lucy, about the topic "${topic}".
They must naturally discuss all of these target words: [${wordListStr}].

DIALOGUE RULE (STRICT):
The conversation MUST HAVE EXACTLY 6 LINES IN TOTAL:
1. Tom: ...
2. Lucy: ...
3. Tom: ...
4. Lucy: ...
5. Tom: ...
6. Lucy: ...
DO NOT write more than 6 lines. Total lines = exactly 6.

QUESTION RULES:
1. For EACH word in [${wordListStr}], create EXACTLY 1 multiple-choice question (A, B, C, D) asking about the specific detail discussed in the dialogue.
2. Each question MUST have 4 clear choices in "options" array (no "A." prefix). One choice is the correct answer.
3. "correctAnswer" MUST exactly match one of the items in "options".

Return ONLY raw JSON with NO markdown formatting:
{
  "dialogue": [
    {"speaker": "Tom", "text": "Hi, Lucy! Look at this cool ..."},
    {"speaker": "Lucy", "text": "Hello, Tom! I see a ..."},
    {"speaker": "Tom", "text": "..."},
    {"speaker": "Lucy", "text": "..."},
    {"speaker": "Tom", "text": "..."},
    {"speaker": "Lucy", "text": "..."}
  ],
  "fullTranscript": "Tom: ... Lucy: ...",
  "questions": [
    {
      "id": 1,
      "question": "What does Tom have?",
      "options": ["${wordList[0]}", "Option B", "Option C", "Option D"],
      "correctAnswer": "${wordList[0]}",
      "explanation": "Tom says he has a ${wordList[0]}."
    }
  ]
}`;

    try {
      const reply = await chatbotApi.ask(prompt);
      const parsed = extractJsonFromAiReply<{
        dialogue: ListeningDialogueLine[];
        fullTranscript: string;
        questions: ListeningQuestion[];
      }>(reply);

      if (
        parsed &&
        Array.isArray(parsed.dialogue) &&
        parsed.dialogue.length >= 4 &&
        Array.isArray(parsed.questions) &&
        parsed.questions.length > 0
      ) {
        // Cắt đúng 6 câu hội thoại (3 Tom, 3 Lucy)
        const exact6Dialogue = parsed.dialogue.slice(0, 6);
        while (exact6Dialogue.length < 6) {
          const spk = exact6Dialogue.length % 2 === 0 ? 'Tom' : 'Lucy';
          exact6Dialogue.push({ spk: spk, speaker: spk, text: 'We had a wonderful day exploring together!' });
        }

        const fullTranscript =
          exact6Dialogue.map((d) => `${d.speaker}: ${d.text}`).join(' ');

        // ── CHUẨN HOÁ CÂU HỎI & ĐÁP ÁN: Đảm bảo khớp 100% với danh sách từ vựng và nội dung thoại ──
        const validatedQuestions: ListeningQuestion[] = words.map((w, idx) => {
          const rawQ =
            parsed.questions.find((q) =>
              q.question?.toLowerCase().includes(w.word.toLowerCase()) ||
              q.correctAnswer?.toLowerCase().includes(w.word.toLowerCase())
            ) || parsed.questions[idx] || parsed.questions[0];

          const cleanTarget = w.word.trim();
          let cleanOptions = (rawQ?.options || []).map((opt) =>
            opt.replace(/^[a-d]\.\s*/i, '').replace(/^(a|an|the)\s+/i, '').trim()
          ).filter(Boolean);

          // Đảm bảo từ mục tiêu luôn có mặt trong danh sách lựa chọn
          if (!cleanOptions.some((o) => o.toLowerCase() === cleanTarget.toLowerCase())) {
            cleanOptions.unshift(cleanTarget);
          }

          // Bổ sung các distractors nếu thiếu, tránh trùng lặp
          const sampleDistractors = ['apple', 'book', 'ball', 'car', 'tree', 'pen', 'dog', 'chair', 'hat', 'cake']
            .filter((d) => d.toLowerCase() !== cleanTarget.toLowerCase());

          for (const d of sampleDistractors) {
            if (cleanOptions.length >= 4) break;
            if (!cleanOptions.some((o) => o.toLowerCase() === d.toLowerCase())) {
              cleanOptions.push(d);
            }
          }
          cleanOptions = cleanOptions.slice(0, 4);

          return {
            id: idx + 1,
            question: rawQ?.question || `What item did Tom and Lucy talk about?`,
            options: cleanOptions,
            correctAnswer: cleanTarget,
            explanation: rawQ?.explanation || `In the conversation, they talked about the ${cleanTarget}.`,
          };
        });

        return {
          pageIndex,
          topic,
          words,
          dialogue: exact6Dialogue,
          fullTranscript,
          questions: validatedQuestions,
        };
      }
    } catch (err) {
      console.warn('[PersonalizedPracticeService] AI generate Listening failed, using rich fallback:', err);
    }

    // Fallback template đúng chính xác 6 câu đối đáp qua lại
    const w0 = words[0]?.word || 'train';
    const w1 = words[1]?.word || 'lorry';
    const w2 = words[2]?.word || 'helicopter';
    const w3 = words[3]?.word || 'swim';

    const fallbackDialogue: ListeningDialogueLine[] = [
      { speaker: 'Tom', text: `Hi Lucy, look at this fast ${w0} near the station!` },
      { speaker: 'Lucy', text: `Wow, I really love that ${w0}! And is that a big ${w1} on the road?` },
      { speaker: 'Tom', text: `Yes, it is! My brother also saw a ${w2} flying in the sky.` },
      { speaker: 'Lucy', text: `That is awesome, and this afternoon we can go for a ${w3}.` },
      { speaker: 'Tom', text: `We learned so many great things about ${topic} today!` },
      { speaker: 'Lucy', text: `Yes, we did! Learning English with you is always so fun.` },
    ];

    const fallbackQuestions: ListeningQuestion[] = words.map((w, idx) => {
      let qText = '';
      if (idx === 0) qText = `What did Tom see near the station?`;
      else if (idx === 1) qText = `What is on the road?`;
      else if (idx === 2) qText = `What was flying in the sky?`;
      else qText = `What can they do this afternoon?`;

      const pool = ['apple', 'book', 'ball', 'car', 'tree', 'pen', 'dog', 'chair', 'hat', 'cake']
        .filter((d) => d.toLowerCase() !== w.word.toLowerCase());

      const dist = pool.slice(0, 3);
      const options = [w.word, ...dist];

      return {
        id: idx + 1,
        question: qText,
        options,
        correctAnswer: w.word,
        explanation: `In the conversation, the characters clearly mentioned the ${w.word}.`,
      };
    });

    return {
      pageIndex,
      topic,
      words,
      dialogue: fallbackDialogue,
      fullTranscript: fallbackDialogue.map((d) => `${d.speaker}: ${d.text}`).join(' '),
      questions: fallbackQuestions,
    };
  },
};
