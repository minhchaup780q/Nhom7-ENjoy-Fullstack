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

// Fallback curated image map nếu từ vựng chưa có ảnh từ bài thi
const TOPIC_FALLBACK_IMAGES: Record<string, string> = {
  // Animals
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400',
  tail: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
  duck: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
  frog: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
  tiger: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400',
  horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
  elephant: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400',
  monkey: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400',
  cow: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400',
  pig: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
  chicken: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
  // Colours
  red: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400',
  yellow: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400',
  pink: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400',
  brown: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400',
  grey: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  blue: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  green: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
  // Transport
  train: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
  lorry: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
  helicopter: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400',
  swim: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400',
  bike: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
  car: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
  // The home
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  table: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400',
  bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
  door: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400',
  // Toys
  robot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  doll: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
  ball: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400',
  // Names & Numbers
  pat: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  sam: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  '1': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
  '3': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
  '12': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
  // Sports & Leisure
  kite: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400',
  piano: 'https://images.unsplash.com/photo-1520523839898-50712140a7a7?w=400',
  // The world around us
  sun: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
};

export const getWordImageUrl = (word: string, customImage?: string | null): string => {
  if (customImage && customImage.trim().length > 0) return customImage.trim();
  const clean = word.trim().toLowerCase();
  if (TOPIC_FALLBACK_IMAGES[clean]) return TOPIC_FALLBACK_IMAGES[clean];
  return `https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400`;
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

export const personalizedPracticeService = {
  /**
   * Lấy danh sách từ vựng cần cải thiện của user theo topic hoặc ALL
   */
  loadWeakWords: async (userId: number, topicName: string): Promise<TopicWeakWordDetail[]> => {
    try {
      const isAll = !topicName || topicName === 'ALL' || topicName === 'Tất cả' || topicName === 'Tất cả các chủ đề';
      const words = await vocabStatsApi.getTopicWeakWords(userId, isAll ? 'ALL' : topicName);
      // Đảm bảo mỗi từ đều có ảnh hợp lệ
      return (words || []).map((w) => ({
        ...w,
        imageUrl: getWordImageUrl(w.word, w.imageUrl),
      }));
    } catch (err) {
      console.error('[PersonalizedPracticeService] Lỗi khi tải từ yếu của bài thi:', err);
      return [];
    }
  },

  /**
   * Gom từ vựng theo từng topic và chia mỗi topic thành các trang từ 2 đến 4 từ
   * "đem các lỗi đó theo từng topic gom lại chia làm 2 vòng là vòng nghe và vòng đọc:
   * dựa theo số câu sẽ chia ra nhiều trang, ít nhất 2 từ và nhiều nhất 4 từ để tạo ra 1 trang trong 1 topic"
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
          // Chia 3 và 2 để tránh trang cuối chỉ có 1 từ
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
   */
  generateReadingExercise: async (
    pageIndex: number,
    topic: string,
    words: TopicWeakWordDetail[]
  ): Promise<ReadingExerciseData> => {
    const wordList = words.map((w) => w.word);
    const wordListStr = wordList.join(', ');

    const prompt = `You are a Cambridge English: Starters (Pre-A1) test creator.
Write a simple, charming children's story for topic "${topic}".
The story MUST naturally use all of these target words: [${wordListStr}].
Use simple vocabulary suitable for 6-8 year old learners.
Format the story like Cambridge Reading & Writing Part 4, with blanks (1), (2), (3)... exactly at the target words.
Return ONLY valid raw JSON with NO markdown formatting:
{
  "title": "A short story title",
  "fullStory": "The complete story with target words in place.",
  "blankStory": "The story with numbered blanks like (1) [____], (2) [____]...",
  "blanks": [
    {"position": 1, "answer": "${wordList[0]}", "hint": "Gợi ý nghĩa tiếng Việt ngắn"},
    {"position": 2, "answer": "${wordList[1] || ''}", "hint": "Gợi ý nghĩa tiếng Việt ngắn"}
  ],
  "vietnameseTranslation": "Bản dịch nghĩa toàn bài sang tiếng Việt cho bé."
}`;

    try {
      const reply = await chatbotApi.ask(prompt);
      const parsed = extractJsonFromAiReply<{
        title: string;
        fullStory: string;
        blankStory: string;
        blanks: ReadingBlank[];
        vietnameseTranslation?: string;
      }>(reply);

      if (parsed && parsed.blanks && parsed.blanks.length > 0) {
        return {
          pageIndex,
          topic,
          words,
          title: parsed.title || `Câu chuyện về ${topic}`,
          fullStory: parsed.fullStory,
          blankStory: parsed.blankStory,
          blanks: parsed.blanks,
          vietnameseTranslation: parsed.vietnameseTranslation,
        };
      }
    } catch (err) {
      console.warn('[PersonalizedPracticeService] AI generate Reading failed, fallback:', err);
    }

    // Fallback template nếu AI gặp sự cố
    const blanks: ReadingBlank[] = words.map((w, idx) => ({
      position: idx + 1,
      answer: w.word,
      hint: w.meaning || w.word,
    }));
    const storySentences = words.map((w, idx) => `We can see a (${idx + 1}) [____] in our daily life.`).join(' ');

    return {
      pageIndex,
      topic,
      words,
      title: `Chủ đề: ${topic}`,
      fullStory: words.map((w) => `We can see a ${w.word} in our daily life.`).join(' '),
      blankStory: storySentences,
      blanks,
      vietnameseTranslation: 'Hãy quan sát từ trong Word Bank và điền đúng vị trí nhé!',
    };
  },

  /**
   * VÒNG NGHE: Gọi AI chatbot sinh đoạn hội thoại tự nhiên dài (8-12 lượt đối đáp qua lại)
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
Create a lively, natural, and engaging back-and-forth conversation between two children, Tom and Lucy, about the topic "${topic}".
They MUST talk back and forth (at least 8 to 12 dialogue turns) and naturally discuss ALL of these target words: [${wordListStr}].

CONVERSATION RULES:
1. The conversation MUST be detailed and long enough (between 8 and 12 alternating turns: Tom -> Lucy -> Tom -> Lucy...).
2. They should ask questions, answer, express excitement, describe colors, actions, locations, and feelings.
3. Each target word from [${wordListStr}] must be clearly mentioned at least once with specific details (e.g. Tom has it, Lucy sees it, what color it is, or what it does).
4. Language must be Pre-A1 Starters level (simple, clear, cheerful English for 6-8 year olds).

QUESTION RULES:
1. For EACH word in [${wordListStr}], create EXACTLY 1 multiple-choice question (A, B, C, D) asking about the specific detail discussed in the dialogue.
2. Each question MUST have 4 clear choices (A, B, C, D) in the "options" array. One choice is the correct answer; the other 3 are plausible distractors.
3. "correctAnswer" MUST exactly match one of the items in "options".
4. Provide a clear "explanation" in child-friendly English.

Return ONLY valid raw JSON with NO markdown formatting:
{
  "dialogue": [
    {"speaker": "Tom", "text": "Hi, Lucy! What are you doing in the garden today?"},
    {"speaker": "Lucy", "text": "Hello, Tom! I am playing with my toys and looking around. Come look at this!"},
    {"speaker": "Tom", "text": "Oh, wow! What is that under the big green tree?"},
    {"speaker": "Lucy", "text": "That is my favorite ... It is so cute!"},
    {"speaker": "Tom", "text": "..."},
    {"speaker": "Lucy", "text": "..."}
  ],
  "fullTranscript": "Tom: Hi, Lucy! What are you doing in the garden today? Lucy: Hello, Tom! ...",
  "questions": [
    {
      "id": 1,
      "question": "What is Lucy playing with?",
      "options": ["A doll", "A ball", "A kite", "A robot"],
      "correctAnswer": "A kite",
      "explanation": "Lucy says she is playing with her kite in the garden."
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

      if (parsed && Array.isArray(parsed.dialogue) && parsed.dialogue.length >= 6 && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        const fullTranscript = parsed.fullTranscript || parsed.dialogue.map((d) => `${d.speaker}: ${d.text}`).join(' ');
        return {
          pageIndex,
          topic,
          words,
          dialogue: parsed.dialogue,
          fullTranscript,
          questions: parsed.questions,
        };
      }
    } catch (err) {
      console.warn('[PersonalizedPracticeService] AI generate Listening failed, using rich fallback:', err);
    }

    // Fallback template dài và đối đáp qua lại chi tiết
    const w0 = words[0]?.word || 'book';
    const w1 = words[1]?.word || 'pencil';
    const w2 = words[2]?.word || 'ruler';
    const w3 = words[3]?.word || 'bag';

    const fallbackDialogue: ListeningDialogueLine[] = [
      { speaker: 'Tom', text: `Hi, Lucy! What a sunny day to explore our ${topic} lesson!` },
      { speaker: 'Lucy', text: `Hello, Tom! I am so happy to see you. What do you have there?` },
      { speaker: 'Tom', text: `Look in my hands! I found a wonderful ${w0}. Do you like it?` },
      { speaker: 'Lucy', text: `Yes, I love this ${w0}! It looks bright and colorful.` },
      { speaker: 'Tom', text: `And what is that sitting on the table over there, Lucy?` },
      { speaker: 'Lucy', text: `Oh, that is my brother's ${w1}. He uses it every morning at school.` },
      ...(words.length > 2
        ? [
            { speaker: 'Tom', text: `That is cool! Wait, look near the window! Is that a ${w2}?` },
            { speaker: 'Lucy', text: `Yes! It is a big ${w2}. My teacher gave it to me yesterday.` },
          ]
        : []),
      ...(words.length > 3
        ? [
            { speaker: 'Tom', text: `And what is inside the green box on the floor?` },
            { speaker: 'Lucy', text: `There is a brand new ${w3} inside the box!` },
          ]
        : []),
      { speaker: 'Tom', text: `We discovered so many exciting things about ${topic} today!` },
      { speaker: 'Lucy', text: `Yes, we did! That was really fun, Tom. Thank you!` },
    ];

    const fallbackQuestions: ListeningQuestion[] = words.map((w, idx) => {
      let qText = '';
      if (idx === 0) qText = `What does Tom have in his hands?`;
      else if (idx === 1) qText = `What is on the table?`;
      else if (idx === 2) qText = `What does Lucy have near the window?`;
      else qText = `What is inside the green box?`;

      return {
        id: idx + 1,
        question: qText,
        options: [w.word, 'car', 'apple', 'ball'],
        correctAnswer: w.word,
        explanation: `In the conversation, they talked about the ${w.word}.`,
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
