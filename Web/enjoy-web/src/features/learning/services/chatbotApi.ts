import axios from 'axios';
import { apiClient, BASE_URL } from '../../../services/apiClient';
import type { MistakeItem } from './mistakeApi';

export interface ChatbotResponse {
  reply: string;
  userId?: string;
  conversationId?: string;
}

export interface ApiResponseWrapper<T> {
  code: number;
  message: string;
  data: T;
}

const DIRECT_CHATBOT_URL = 'http://localhost:8085';

export const chatbotApi = {
  // Gửi tin nhắn tự do cho AI
  ask: async (message: string, context?: string): Promise<string> => {
    console.log('[ChatbotAPI] 🚀 Đang gửi yêu cầu tới AI:', { message, context, gateway: `${BASE_URL}/api/v1/chatbot/ask` });

    // Bước 1: Thử gọi qua API Gateway (port 8888)
    try {
      const res = await apiClient.post<ApiResponseWrapper<ChatbotResponse>>('/api/v1/chatbot/ask', {
        message,
        context,
      });
      console.log('[ChatbotAPI] ✅ AI phản hồi thành công qua Gateway:', res);
      return res.data?.reply || 'Không có nội dung phản hồi từ AI.';
    } catch (gatewayErr: unknown) {
      console.warn('[ChatbotAPI] ⚠️ Gọi qua Gateway thất bại, đang thử gọi trực tiếp port 8085...', gatewayErr);

      // Bước 2: Fallback gọi trực tiếp chatbot-service (port 8085)
      try {
        const directRes = await axios.post<ApiResponseWrapper<ChatbotResponse>>(
          `${DIRECT_CHATBOT_URL}/api/v1/chatbot/ask`,
          { message, context },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        console.log('[ChatbotAPI] ✅ AI phản hồi thành công qua direct port 8085:', directRes.data);
        return directRes.data.data?.reply || directRes.data.message || 'Không có phản hồi từ AI.';
      } catch (directErr: unknown) {
        console.error('[ChatbotAPI] ❌ Cả 2 cổng Gateway (8888) và Trực tiếp (8085) đều không kết nối được:', directErr);
        return 'Trợ lý AI đang khởi động hoặc tạm thời gián đoạn kết nối. Bé hãy xem lại từ vựng và đáp án đúng phía trên nhé!';
      }
    }
  },

  // Phân tích thông minh lý do bé làm sai theo từng vòng học (So sánh trực diện từ khóa/câu bé làm & đáp án chuẩn)
  explainMistake: async (item: MistakeItem, currentAttempt?: string): Promise<string> => {
    const targetText = item.contentText || item.keyword || '';
    const keyword = item.keyword || '';
    const translation = item.translation || '';
    const rawWrong = currentAttempt || item.wrongAnswerSubmitted || 'chưa chính xác';
    const roundType = item.roundType;

    // Tự động giải mã nếu câu trả lời là URL ảnh cũ
    let wrong = rawWrong;
    if (rawWrong.startsWith('http://') || rawWrong.startsWith('https://') || rawWrong.startsWith('/') || rawWrong.includes('.jpg') || rawWrong.includes('.png')) {
      const parts = rawWrong.split('/').pop()?.split('.')[0]?.split('-')[0]?.split('?')[0];
      wrong = (parts && parts.length > 2 && isNaN(Number(parts))) ? parts : 'chưa chính xác';
    }

    let prompt = '';

    switch (roundType) {
      case 1:
        // Vòng 1: Nhận diện từ vựng qua Flashcard / Hình ảnh
        prompt = `Trong bài học nhận diện từ vựng tiếng Anh qua hình ảnh cho học sinh tiểu học:
- Đáp án chính xác của bức hình: "${targetText}" ${keyword && keyword !== targetText ? `(Từ khóa: "${keyword}")` : ''} (Nghĩa tiếng Việt: "${translation}")
- Câu trả lời bé đã chọn: "${wrong}"

Hãy so sánh trực diện và hướng dẫn bé bằng tiếng Việt (tối đa 3 câu):
1. Phân tích: Đáp án đúng là "${targetText}" (${translation}), trong khi câu trả lời bé chọn là "${wrong}".
2. Nêu đặc điểm nhận diện hình ảnh của "${targetText}" để bé nhìn lại và chọn lại đúng từ.`;
        break;

      case 2:
        // Vòng 2: Luyện nghe (Listening) - Nghe âm thanh và chọn hình ảnh đúng
        prompt = `Trong bài luyện nghe tiếng Anh cho học sinh tiểu học (Bé nghe âm thanh phát âm và nhìn các hình để chọn hình ảnh đúng):
- Âm thanh phát âm chuẩn cần nghe: "${targetText}" ${keyword && keyword !== targetText ? `(Từ khóa hình ảnh: "${keyword}")` : ''} (Nghĩa tiếng Việt: "${translation}")
- Bức hình bé đã chọn nhầm là hình của từ: "${wrong}"

Hãy so sánh trực diện và hướng dẫn bé bằng tiếng Việt (tối đa 3 câu):
1. Phân tích lỗi sai: Âm thanh đọc là "${targetText}" (${translation}), nhưng bé lại chọn bức hình của "${wrong}". Hãy chỉ ra sự khác biệt rõ rệt giữa hai từ này (về cách phát âm hoặc đặc điểm hình ảnh).
2. Hướng dẫn cách chọn đúng: Chỉ cho bé dấu hiệu nhận biết của bức hình đại diện cho "${targetText}" để bé nhìn tranh và chọn lại cho chuẩn xác.`;
        break;

      case 3:
        // Vòng 3: Luyện phát âm AI (Speaking) - So sánh trực diện 2 câu
        prompt = `Trong bài luyện phát âm tiếng Anh tiểu học:
- Câu/từ chuẩn cần đọc: "${targetText}" (Nghĩa tiếng Việt: "${translation}")
- Câu/từ thực tế bé đã đọc: "${wrong}"

Hãy so sánh trực diện câu bé đọc với câu mẫu:
1. Chỉ ra rõ bé đọc sai ở từ nào hoặc âm nào (ví dụ: phát âm nhầm từ nào thành từ nào, thiếu âm đuôi /s/, /t/, /k/, /d/, hay nhầm nguyên âm).
2. Hướng dẫn khẩu hình miệng và cách phát âm chuẩn thật ngắn gọn, dễ thương, dễ hiểu bằng tiếng Việt (tối đa 3 câu) để bé đọc lại cho đúng.`;
        break;

      case 4:
        // Vòng 4: Nhìn hình & Đọc câu hỏi để chọn đáp án đúng (Quiz / Reading / Word Recognition)
        const questionSentence = item.contentText || 'Câu hỏi';
        const targetAnswer = item.keyword || item.contentText || '';
        prompt = `Trong bài tập tiếng Anh tiểu học (Bé nhìn hình ảnh minh họa và đọc câu hỏi để chọn đáp án đúng):
- Câu hỏi của bài: "${questionSentence}" ${translation ? `(Dịch nghĩa: "${translation}")` : ''}
- Bức hình minh họa cho đáp án đúng là: "${targetAnswer}"
- Câu trả lời bé đã chọn: "${wrong}"

Hãy so sánh trực diện và giải thích cho bé bằng tiếng Việt (tối đa 3 câu):
1. Phân tích lỗi sai: Bức hình minh họa cho "${targetAnswer}", do đó đáp án đúng cho câu hỏi "${questionSentence}" phải là "${targetAnswer}". Việc bé chọn "${wrong}" là chưa đúng vì "${wrong}" mang ý nghĩa khác, không khớp với hình ảnh của câu hỏi.
2. Hướng dẫn cách chọn đúng: Nhắc bé quan sát kỹ chi tiết bức hình và liên hệ với từ "${targetAnswer}" để chọn lại đáp án cho chính xác.`;
        break;

      case 5:
        // Vòng 5: Điền từ & Chính tả (Spelling & Writing)
        prompt = `Trong bài tập ghép chữ / điền từ tiếng Anh:
- Từ/Câu đúng chuẩn: "${targetText}" (Nghĩa: "${translation}")
- Từ/Câu bé đã viết: "${wrong}"

Hãy so sánh trực diện mặt chữ giữa 2 từ:
1. Chỉ ra vị trí chữ cái bé viết thiếu, thừa hoặc sai thứ tự.
2. Đưa ra mẹo nhớ mặt chữ cho bé bằng tiếng Việt (tối đa 3 câu).`;
        break;

      default:
        prompt = `Từ/câu tiếng Anh chuẩn là "${targetText}" (Nghĩa: "${translation}"). Bé đã chọn/trả lời là "${wrong}".
Hãy so sánh lỗi sai của bé với đáp án chuẩn và hướng dẫn bé cách chọn lại cho đúng bằng tiếng Việt (tối đa 3 câu).`;
        break;
    }

    const context = `Bạn là Trợ lý AI ENjoy hỗ trợ học sinh tiểu học học tiếng Anh. Trả lời thân thiện, dễ hiểu, không dùng từ ngữ học thuật phức tạp, so sánh trực diện giữa đáp án chính xác "${targetText}" và câu trả lời của bé "${wrong}" để giúp bé chọn lại cho đúng.`;
    return chatbotApi.ask(prompt, context);
  },

  // Sinh câu chuyện và thử thách ngữ cảnh thích ứng theo đúng chủ đề và câu làm sai
  generateAdaptiveChallenge: async (
    skillName: string,
    mistakes: { word: string; translation?: string; wrongAttempt?: string }[],
    topicName: string = 'Tổng hợp'
  ): Promise<AdaptiveChallenge> => {
    const mistakeDetailStr = mistakes.map((m, idx) => 
      `${idx + 1}. Từ đúng: "${m.word}" (${m.translation || ''}) ${m.wrongAttempt && m.wrongAttempt !== 'Chưa học' ? `- Bé từng làm sai thành: "${m.wrongAttempt}"` : ''}`
    ).join('\n');

    const targetWordsStr = mistakes.map((m) => m.word).filter(Boolean).join(', ');

    const prompt = `Bạn là Trợ lý AI giáo dục tiếng Anh cho học sinh tiểu học ENjoy.
Bé đang luyện tập khắc phục kỹ năng "${skillName}" theo CHỦ ĐỀ: "${topicName}".
Dưới đây là danh sách các từ bé ĐÃ LÀM SAI cần khắc phục trong chủ đề này:
${mistakeDetailStr}

Hãy sáng tạo một bài học mini thích ứng ngắn gọn, vui tươi gắn liền với CHỦ ĐỀ "${topicName}":
1. "story": Một đoạn văn ngắn 1-2 câu BẰNG TIẾNG VIỆT xoay quanh chủ đề "${topicName}". Trong đoạn tiếng Việt này, CHỈ RIÊNG các từ tiếng Anh bé làm sai [${targetWordsStr}] được viết bằng TIẾNG ANH IN ĐẬM VÀ BỌC TRONG DẤU ** (Ví dụ trong chủ đề School: "Hôm nay bạn nhỏ mở chiếc **backpack** để lấy cây **pencil** viết bài.").
2. "storyVi": Để rỗng "" vì đoạn story đã là tiếng Việt.
3. "question": Câu hỏi trắc nghiệm tiếng Việt ngắn gọn kiểm tra từ tiếng Anh bé hay nhầm lẫn dựa vào câu chuyện trên.
4. "options": 4 phương án tiếng Anh (gồm từ đúng và các từ gây nhiễu / từ bé từng gõ sai).
5. "correctAnswer": Từ tiếng Anh chính xác (trùng khớp 1 phương án trong options).
6. "hint": Mẹo nhớ ngắn gọn bằng tiếng Việt giúp bé không lặp lại lỗi sai nữa.

Trả về DUY NHẤT 1 chuỗi JSON hợp lệ (không kèm markdown \`\`\`json):
{
  "title": "Tên câu chuyện ngắn tiếng Việt theo chủ đề ${topicName}",
  "story": "Đoạn văn tiếng Việt 1-2 câu chêm từ **EnglishWord**",
  "storyVi": "",
  "question": "Câu hỏi ngắn bằng tiếng Việt",
  "options": ["word1", "word2", "word3", "word4"],
  "correctAnswer": "word1",
  "hint": "Mẹo nhớ ngắn gọn bằng tiếng Việt"
}`;

    const context = `Bạn là AI giáo dục ENjoy. Tạo nội dung rèn luyện tiếng Anh thích ứng theo chủ đề "${topicName}". Chỉ trả về JSON nguyên bản.`;

    try {
      const rawResponse = await chatbotApi.ask(prompt, context);

      let cleaned = rawResponse.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const parsed: AdaptiveChallenge = JSON.parse(cleaned);
      if (parsed.question && parsed.options && parsed.correctAnswer) {
        return parsed;
      }
      throw new Error('Dữ liệu JSON không đủ trường');
    } catch (err) {
      console.warn('[ChatbotAPI] Không thể parse JSON từ AI, dùng fallback theo chủ đề:', err);
      const primaryWord = mistakes[0]?.word || 'book';
      const primaryTrans = mistakes[0]?.translation || 'quyển sách';
      return {
        title: `Chủ đề ${topicName}: Cùng nhớ từ "${primaryWord}"`,
        story: `Trong giờ học chủ đề ${topicName}, bạn nhỏ cẩn thận mang theo một **${primaryWord}** xinh xắn để cùng học tập.`,
        storyVi: '',
        question: `Từ tiếng Anh nào trong câu chuyện chỉ "${primaryTrans}"?`,
        options: [primaryWord, 'apple', 'desk', 'pen'],
        correctAnswer: primaryWord,
        hint: `Hãy nhớ lại từ vựng "${primaryTrans}" trong chủ đề ${topicName} nhé bé!`
      };
    }
  },

  // Chuẩn đoán lỗi phát âm tự động 100% kết hợp AI LLM & Bộ phân tích âm vị học toàn diện (Không bao giờ mất dữ liệu)
  diagnoseSpeakingMistakes: async (
    mistakes: MistakeItem[]
  ): Promise<SpeakingDiagnosisResult> => {
    if (!mistakes || mistakes.length === 0) {
      return {
        completelyWrongItems: [],
        nearCorrectItems: [],
        summary: 'Bé chưa có câu làm sai nào trong phần luyện phát âm.',
      };
    }

    // Hàm tự động nhận diện âm vị & mẹo khẩu hình cho BẤT KỲ từ tiếng Anh nào (300-400 bài)
    const resolvePhoneticMeta = (word: string, recognized: string) => {
      const w = word.toLowerCase().trim();
      const r = recognized.toLowerCase().trim();

      // Mặc định
      let focusPhoneme = w.slice(0, 2);
      let phonemeType: 'consonant' | 'vowel' = 'consonant';
      let phonemeNameVi = `Âm /${focusPhoneme}/`;
      let wrongLabel = `Lệch âm giữa từ chuẩn "${w}" và âm bé đọc "${r}"`;
      let mouthTip = 'Mở rộng khẩu hình miệng to rõ, chú ý đặt đúng vị trí lưỡi và bật hơi dứt khoát.';

      if (w.startsWith('th')) {
        focusPhoneme = 'θ';
        phonemeNameVi = 'Phụ âm thổi hơi /θ/';
        wrongLabel = r.startsWith('t') || r.startsWith('d') ? `Sai âm đầu /θ/ (bé đọc nhầm thành âm /${r[0]} trong "${r}")` : `Sai âm đầu thổi hơi /θ/`;
        mouthTip = 'Đặt nhẹ đầu lưỡi vào giữa 2 hàm răng trên và dưới, sau đó thổi nhẹ luồng hơi ra ngoài.';
      } else if (w.startsWith('sh') || w.endsWith('sh')) {
        focusPhoneme = 'ʃ';
        phonemeNameVi = 'Phụ âm gió /ʃ/';
        wrongLabel = `Sai âm gió /ʃ/ (dễ nhầm thành /s/)`;
        mouthTip = 'Chu tròn môi về phía trước và đẩy luồng hơi dài "shhh".';
      } else if (w.startsWith('ch') || w.endsWith('ch')) {
        focusPhoneme = 'tʃ';
        phonemeNameVi = 'Phụ âm tắc xát /tʃ/';
        wrongLabel = `Sai âm /tʃ/ (đọc chưa dứt khoát)`;
        mouthTip = 'Chu môi, nén hơi ở đầu lưỡi rồi bật dứt khoát âm "ch".';
      } else if (w.endsWith('s') || w.endsWith('se') || w.endsWith('x')) {
        focusPhoneme = 's';
        phonemeNameVi = 'Âm gió đuôi /s/';
        wrongLabel = !r.endsWith('s') ? `Quên phát âm âm gió đuôi /s/` : `Lệch âm gió đuôi /s/`;
        mouthTip = 'Khép nhẹ hai hàm răng, khóe miệng cười tươi và đẩy luồng hơi xì nhẹ ở cuối từ.';
      } else if (w.endsWith('v') || w.endsWith('ve')) {
        focusPhoneme = 'v';
        phonemeNameVi = 'Phụ âm rung /v/';
        wrongLabel = `Thiếu hoặc lệch âm rung /v/ cuối từ`;
        mouthTip = 'Răng trên chạm nhẹ môi dưới và rung nhẹ thanh quản khi kết thúc từ.';
      } else if (w.startsWith('t')) {
        focusPhoneme = 't';
        phonemeNameVi = 'Phụ âm bật hơi /t/';
        wrongLabel = r.startsWith('d') ? `Âm /t/ chưa bật hơi (đọc thành /d/ trong "${r}")` : `Bật hơi âm đầu /t/ chưa dứt khoát`;
        mouthTip = 'Đặt đầu lưỡi chạm nướu răng trên, nén hơi rồi bật mạnh dứt khoát.';
      } else if (w.startsWith('p')) {
        focusPhoneme = 'p';
        phonemeNameVi = 'Phụ âm bật môi /p/';
        wrongLabel = `Bật hơi âm /p/ chưa đủ mạnh`;
        mouthTip = 'Mím chặt hai môi lại rồi bật mạnh luồng hơi ra ngoài.';
      } else if (w.startsWith('k') || w.startsWith('c')) {
        focusPhoneme = 'k';
        phonemeNameVi = 'Phụ âm cuống họng /k/';
        wrongLabel = `Âm bật /k/ ở cuống họng chưa rõ`;
        mouthTip = 'Nâng cuống lưỡi chạm vòm họng mềm rồi bật nhẹ luồng hơi.';
      } else if (w.includes('ee') || w.includes('ea')) {
        focusPhoneme = 'iː';
        phonemeType = 'vowel';
        phonemeNameVi = 'Nguyên âm dài /iː/';
        wrongLabel = `Đọc nguyên âm dài /iː/ chưa đủ độ ngân`;
        mouthTip = 'Kéo căng khóe miệng sang hai bên như đang cười tươi và ngân dài âm "ee".';
      } else if (w.includes('oo')) {
        focusPhoneme = 'ʊ';
        phonemeType = 'vowel';
        phonemeNameVi = 'Nguyên âm /ʊ/';
        wrongLabel = `Lệch nguyên âm /ʊ/`;
        mouthTip = 'Thả lỏng môi, chu nhẹ miệng và phát âm dứt khoát.';
      } else if (['a', 'e', 'i', 'o', 'u'].includes(w[0])) {
        focusPhoneme = w[0];
        phonemeType = 'vowel';
        phonemeNameVi = `Nguyên âm /${w[0]}/`;
        wrongLabel = `Lệch nguyên âm đầu /${w[0]}/`;
        mouthTip = 'Mở rộng khẩu hình miệng theo đúng nguyên âm và đọc to rõ.';
      }

      return { focusPhoneme, phonemeType, phonemeNameVi, wrongLabel, mouthTip };
    };

    // 1. Xây dựng danh sách chuẩn hóa 100% đầy đủ cho từng câu lỗi từ DB
    const completeAnalyzedList: AnalyzedSpeakingItem[] = mistakes.map((m) => {
      const target = (m.contentText || m.keyword || '').replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim().toLowerCase();
      let rawRecognized = m.recognizedAudioTranscript || m.wrongAnswerSubmitted || '';
      if (/[\u4e00-\u9fff]/.test(rawRecognized) && m.wrongAnswerSubmitted && !/[\u4e00-\u9fff]/.test(m.wrongAnswerSubmitted)) {
        rawRecognized = m.wrongAnswerSubmitted;
      }
      const recognized = rawRecognized.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim().toLowerCase();
      const displayRecognized = recognized || rawRecognized.trim() || 'Chưa nói được';

      // Đo độ tương đồng để phân loại
      let isCompletelyWrong = false;
      if (!recognized || recognized === 'chưa học' || recognized === 'chưa nói được' || recognized.length === 0) {
        isCompletelyWrong = true;
      } else if (target !== recognized) {
        const targetChars = new Set(target.split(''));
        const matchingChars = recognized.split('').filter((c) => targetChars.has(c)).length;
        const similarity = matchingChars / Math.max(target.length, recognized.length);
        if (similarity < 0.35) {
          isCompletelyWrong = true;
        }
      }

      const meta = resolvePhoneticMeta(target, displayRecognized);

      return {
        id: m.id,
        questionId: m.questionId,
        word: target,
        ipa: `/${target}/`,
        focusPhoneme: meta.focusPhoneme,
        phonemeType: meta.phonemeType,
        phonemeNameVi: meta.phonemeNameVi,
        videoUrl: undefined,
        translation: m.translation || 'Từ vựng',
        imageUrl: m.imageUrl,
        audioUrl: m.audioUrl,
        topic: m.keyword?.trim() || 'Chủ đề chung',
        recognizedText: displayRecognized,
        classification: isCompletelyWrong ? 'COMPLETELY_WRONG' : 'NEAR_CORRECT_PHONEME',
        wrongPhonemeLabel: isCompletelyWrong ? 'Chưa nhớ từ vựng' : meta.wrongLabel,
        mouthShapeGuide: meta.mouthTip,
        aiAnalysisVi: isCompletelyWrong
          ? `Bé chưa nhớ rõ từ vựng "${target}" (${m.translation || ''}). Cần ôn lại Vòng 1 và Vòng 2 để ghi nhớ nhé!`
          : `Bé đọc gần đúng từ "${target}" (${displayRecognized}). Hãy bấm nghe âm mẫu để sửa lại âm này nhé!`,
      };
    });

    // 2. Gọi Chatbot AI (Ollama LLM) làm giàu dữ liệu và sinh câu nhận xét sư phạm
    let aiSummaryText = `AI ENjoy đã phân loại đầy đủ ${completeAnalyzedList.filter(x => x.classification === 'COMPLETELY_WRONG').length} từ sai hoàn toàn và ${completeAnalyzedList.filter(x => x.classification === 'NEAR_CORRECT_PHONEME').length} từ cần chỉnh âm.`;

    try {
      const mistakeDetailsStr = completeAnalyzedList.map((item, i) => 
        `${i + 1}. ID: ${item.id} | Từ: "${item.word}" (${item.translation}) | Bé đọc: "${item.recognizedText}"`
      ).join('\n');

      const prompt = `Bạn là Trợ lý AI giáo dục ENjoy. Hãy đọc danh sách các từ bé phát âm chưa chuẩn:\n${mistakeDetailsStr}\n\nHãy trả về DUY NHẤT 1 chuỗi JSON hợp lệ:
{
  "summary": "1 câu nhận xét sư phạm tổng quan bằng tiếng Việt ngắn gọn, thân thiện",
  "items": [
    {
      "id": ${completeAnalyzedList[0]?.id},
      "ipa": "/.../",
      "focusPhoneme": "âm vị",
      "phonemeNameVi": "tên âm tiếng Việt",
      "mouthShapeGuide": "hướng dẫn khẩu hình răng môi lưỡi ngắn gọn",
      "aiAnalysisVi": "lời khuyên riêng cho từ này"
    }
  ]
}`;

      const context = `Bạn là AI giáo dục ENjoy. Chỉ trả về JSON nguyên bản.`;
      const rawAiResponse = await chatbotApi.ask(prompt, context);

      let cleaned = rawAiResponse.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleaned);

        if (parsed.summary && !parsed.summary.includes('gián đoạn')) {
          aiSummaryText = parsed.summary;
        }

        // Cập nhật làm giàu dữ liệu từ AI nếu có mà KHÔNG LÀM MẤT bất kỳ từ nào
        if (Array.isArray(parsed.items)) {
          parsed.items.forEach((aiItem: any) => {
            const found = completeAnalyzedList.find(x => String(x.id) === String(aiItem.id));
            if (found) {
              if (aiItem.ipa && aiItem.ipa.startsWith('/')) found.ipa = aiItem.ipa;
              if (aiItem.focusPhoneme) found.focusPhoneme = aiItem.focusPhoneme;
              if (aiItem.phonemeNameVi) found.phonemeNameVi = aiItem.phonemeNameVi;
              if (aiItem.mouthShapeGuide) found.mouthShapeGuide = aiItem.mouthShapeGuide;
              if (aiItem.aiAnalysisVi) found.aiAnalysisVi = aiItem.aiAnalysisVi;
            }
          });
        }
      }
    } catch (err) {
      console.warn('[ChatbotAPI] Dynamic AI enrichment fallback:', err);
    }

    const completelyWrongList = completeAnalyzedList.filter(x => x.classification === 'COMPLETELY_WRONG');
    const nearCorrectList = completeAnalyzedList.filter(x => x.classification === 'NEAR_CORRECT_PHONEME');

    return {
      completelyWrongItems: completelyWrongList,
      nearCorrectItems: nearCorrectList,
      summary: aiSummaryText,
    };
  },
  generateSpeakingPersonalizedPlan: async (
    mistakes: MistakeItem[]
  ): Promise<SpeakingPersonalizedPlan> => {
    // 1. Phân tích thống kê từ lịch sử sai
    let endingErrors = 0;
    let vowelErrors = 0;
    let clusterErrors = 0;
    let generalErrors = 0;

    const mistakeDetails = mistakes.map((m) => {
      const target = (m.contentText || m.keyword || '').trim();
      const wrong = (m.recognizedAudioTranscript || m.wrongAnswerSubmitted || '').trim();
      const errType = m.phonemeErrorType || 'GENERAL_MISPRONUNCIATION';
      
      if (errType === 'ENDING_SOUND' || target.endsWith('s') || target.endsWith('ed') || target.endsWith('t')) {
        endingErrors++;
      } else if (errType === 'VOWEL_CONFUSION') {
        vowelErrors++;
      } else if (errType === 'CONSONANT_CLUSTER' || target.includes('th') || target.includes('sh') || target.includes('ch')) {
        clusterErrors++;
      } else {
        generalErrors++;
      }

      return `- Từ chuẩn: "${target}" (${m.translation || ''}) ➜ Bé đã đọc thành: "${wrong}" [Lỗi: ${errType}]`;
    });

    const targetWords = Array.from(
      new Set(
        mistakes
          .map((m) => (m.contentText || m.keyword || '').toLowerCase().trim())
          .filter(Boolean)
      )
    );

    const targetWordsStr = targetWords.length > 0 ? targetWords.join(', ') : 'three, two, cat';

    const total = Math.max(1, mistakes.length);
    const endingScore = Math.max(20, Math.round(100 - (endingErrors / total) * 80));
    const vowelScore = Math.max(30, Math.round(100 - (vowelErrors / total) * 75));
    const clusterScore = Math.max(25, Math.round(100 - (clusterErrors / total) * 75));
    const intonationScore = Math.max(40, Math.round(100 - (generalErrors / total) * 60));

    // Bảng từ điển các cặp từ tương phản tối thiểu thông dụng cho từng từ vựng
    const KNOWN_PAIRS: Record<string, { wordB: string; ipaA: string; ipaB: string; transA: string; transB: string; focusPhoneme: string }> = {
      three: { wordB: 'tree', ipaA: '/θriː/', ipaB: '/triː/', transA: 'số 3 (thổi hơi)', transB: 'cái cây (âm t)', focusPhoneme: '/θ/ vs /t/' },
      two: { wordB: 'do', ipaA: '/tuː/', ipaB: '/duː/', transA: 'số 2 (bật hơi t)', transB: 'làm (âm d)', focusPhoneme: '/t/ vs /d/' },
      one: { wordB: 'won', ipaA: '/wʌn/', ipaB: '/wɒn/', transA: 'số 1', transB: 'chiến thắng', focusPhoneme: '/wʌn/ vs /wɒn/' },
      four: { wordB: 'door', ipaA: '/fɔːr/', ipaB: '/dɔːr/', transA: 'số 4 (âm f)', transB: 'cánh cửa (âm d)', focusPhoneme: '/f/ vs /d/' },
      five: { wordB: 'fine', ipaA: '/faɪv/', ipaB: '/faɪn/', transA: 'số 5 (âm v cuối)', transB: 'khỏe (âm n cuối)', focusPhoneme: '/v/ vs /n/' },
      six: { wordB: 'sick', ipaA: '/sɪks/', ipaB: '/sɪk/', transA: 'số 6 (âm ks cuối)', transB: 'ốm (âm k cuối)', focusPhoneme: '/ks/ vs /k/' },
      seven: { wordB: 'eleven', ipaA: '/ˈsɛv.ən/', ipaB: '/ɪˈlɛv.ən/', transA: 'số 7', transB: 'số 11', focusPhoneme: '/s/ vs /l/' },
      eight: { wordB: 'ate', ipaA: '/eɪt/', ipaB: '/eɪt/', transA: 'số 8 (âm t)', transB: 'đã ăn', focusPhoneme: '/eɪt/' },
      nine: { wordB: 'night', ipaA: '/naɪn/', ipaB: '/naɪt/', transA: 'số 9 (âm n cuối)', transB: 'buổi tối (âm t cuối)', focusPhoneme: '/n/ vs /t/' },
      ten: { wordB: 'pen', ipaA: '/tɛn/', ipaB: '/pɛn/', transA: 'số 10 (âm t)', transB: 'cây bút (âm p)', focusPhoneme: '/t/ vs /p/' },
      red: { wordB: 'bed', ipaA: '/rɛd/', ipaB: '/bɛd/', transA: 'màu đỏ (âm r)', transB: 'cái giường (âm b)', focusPhoneme: '/r/ vs /b/' },
      blue: { wordB: 'glue', ipaA: '/bluː/', ipaB: '/ɡluː/', transA: 'màu xanh dương', transB: 'keo dán', focusPhoneme: '/bl/ vs /gl/' },
      green: { wordB: 'clean', ipaA: '/ɡriːn/', ipaB: '/kliːn/', transA: 'màu xanh lá', transB: 'sạch sẽ', focusPhoneme: '/gr/ vs /cl/' },
      yellow: { wordB: 'hello', ipaA: '/ˈjɛl.oʊ/', ipaB: '/həˈloʊ/', transA: 'màu vàng (âm y)', transB: 'xin chào (âm h)', focusPhoneme: '/j/ vs /h/' },
      pink: { wordB: 'pig', ipaA: '/pɪŋk/', ipaB: '/pɪɡ/', transA: 'màu hồng (âm ngk)', transB: 'con heo (âm g)', focusPhoneme: '/ŋk/ vs /g/' },
      cat: { wordB: 'cut', ipaA: '/kæt/', ipaB: '/kʌt/', transA: 'con mèo', transB: 'cắt', focusPhoneme: '/æ/ vs /ʌ/' },
      dog: { wordB: 'duck', ipaA: '/dɒɡ/', ipaB: '/dʌk/', transA: 'con chó', transB: 'con vịt', focusPhoneme: '/ɒg/ vs /ʌk/' },
      fish: { wordB: 'dish', ipaA: '/fɪʃ/', ipaB: '/dɪʃ/', transA: 'con cá (âm f)', transB: 'cái đĩa (âm d)', focusPhoneme: '/f/ vs /d/' },
      bird: { wordB: 'bed', ipaA: '/bɜːrd/', ipaB: '/bɛd/', transA: 'con chim', transB: 'cái giường', focusPhoneme: '/ɜːr/ vs /ɛ/' },
      book: { wordB: 'look', ipaA: '/bʊk/', ipaB: '/lʊk/', transA: 'quyển sách (âm b)', transB: 'nhìn (âm l)', focusPhoneme: '/b/ vs /l/' },
      pen: { wordB: 'pan', ipaA: '/pɛn/', ipaB: '/pæn/', transA: 'cây bút', transB: 'cái chảo', focusPhoneme: '/ɛ/ vs /æ/' },
      desk: { wordB: 'duck', ipaA: '/dɛsk/', ipaB: '/dʌk/', transA: 'bàn học (âm sk)', transB: 'con vịt', focusPhoneme: '/sk/ vs /k/' },
      chair: { wordB: 'share', ipaA: '/tʃɛər/', ipaB: '/ʃɛər/', transA: 'cái ghế (âm ch)', transB: 'chia sẻ (âm sh)', focusPhoneme: '/tʃ/ vs /ʃ/' },
      apple: { wordB: 'table', ipaA: '/ˈæp.əl/', ipaB: '/ˈteɪ.bəl/', transA: 'quả táo', transB: 'cái bàn', focusPhoneme: '/æ/ vs /eɪ/' },
      water: { wordB: 'waiter', ipaA: '/ˈwɔː.tər/', ipaB: '/ˈweɪ.tər/', transA: 'nước uống', transB: 'người phục vụ', focusPhoneme: '/ɔː/ vs /eɪ/' },
      milk: { wordB: 'silk', ipaA: '/mɪlk/', ipaB: '/sɪlk/', transA: 'sữa (âm m)', transB: 'lụa (âm s)', focusPhoneme: '/m/ vs /s/' },
      ship: { wordB: 'sheep', ipaA: '/ʃɪp/', ipaB: '/ʃiːp/', transA: 'con tàu (ngắn)', transB: 'con cừu (kéo dài)', focusPhoneme: '/ɪ/ vs /iː/' },
      think: { wordB: 'sink', ipaA: '/θɪŋk/', ipaB: '/sɪŋk/', transA: 'suy nghĩ (thổi hơi)', transB: 'chìm (xì gió)', focusPhoneme: '/θ/ vs /s/' },
    };

    // Tạo danh sách Minimal Pairs trực tiếp từ các từ bé làm sai
    const generatedMinimalPairs: MinimalPairItem[] = [];
    targetWords.forEach((word, idx) => {
      const match = KNOWN_PAIRS[word];
      if (match) {
        generatedMinimalPairs.push({
          id: `mp-${idx + 1}`,
          wordA: word,
          ipaA: match.ipaA,
          transA: match.transA,
          wordB: match.wordB,
          ipaB: match.ipaB,
          transB: match.transB,
          focusPhoneme: match.focusPhoneme,
        });
      } else {
        // Fallback tạo cặp tương phản từ chính từ đó
        const mistakeItem = mistakes.find((m) => (m.contentText || m.keyword || '').toLowerCase().trim() === word);
        generatedMinimalPairs.push({
          id: `mp-${idx + 1}`,
          wordA: word,
          ipaA: `/${word}/`,
          transA: mistakeItem?.translation || 'từ cần luyện',
          wordB: `${word}s`,
          ipaB: `/${word}s/`,
          transB: `dạng số nhiều (âm s)`,
          focusPhoneme: `Âm đuôi /s/`,
        });
      }
    });

    if (generatedMinimalPairs.length === 0) {
      generatedMinimalPairs.push(
        { id: 'mp-1', wordA: 'three', ipaA: '/θriː/', transA: 'số 3 (thổi hơi)', wordB: 'tree', ipaB: '/triː/', transB: 'cái cây', focusPhoneme: '/θ/ vs /t/' },
        { id: 'mp-2', wordA: 'two', ipaA: '/tuː/', transA: 'số 2 (bật hơi t)', wordB: 'do', ipaB: '/duː/', transB: 'làm', focusPhoneme: '/t/ vs /d/' }
      );
    }

    // Tạo câu vè vui nhộn chứa chính xác các từ bé sai
    const wordsListText = targetWords.slice(0, 3).join(' và ');
    const generatedRhymes: RhymeTwisterItem[] = [
      {
        id: 'rhyme-1',
        sentence: targetWords.includes('three') && targetWords.includes('two')
          ? 'Two little birds count one, two, three on the tree.'
          : targetWords.length >= 2
          ? `I have ${targetWords[0]} and ${targetWords[1]} in my lovely room.`
          : `Look at the ${targetWords[0] || 'three'}, it is so cool.`,
        phoneticFocus: `Luyện phát âm chuẩn từ: ${wordsListText || 'từ vựng của bé'}`,
        translationVi: targetWords.includes('three') && targetWords.includes('two')
          ? 'Hai chú chim nhỏ đếm một, hai, ba trên cành cây.'
          : `Tôi có ${wordsListText} trong căn phòng đáng yêu của mình.`,
        tips: `Hãy đọc chậm rãi và phát âm rõ từng từ "${targetWords[0] || ''}" ${targetWords[1] ? `và "${targetWords[1]}"` : ''} nhé bé!`,
      },
      {
        id: 'rhyme-2',
        sentence: targetWords.includes('three')
          ? 'Three tall trees stand by the green sea.'
          : targetWords.includes('two')
          ? 'Two cute cats want to play too.'
          : `Say ${targetWords[0] || 'word'} one, two, three times today!`,
        phoneticFocus: `Luyện nhịp điệu & khẩu hình miệng cho từ ${targetWords[0] || ''}`,
        translationVi: targetWords.includes('three')
          ? 'Ba cái cây cao đứng bên bờ biển xanh.'
          : targetWords.includes('two')
          ? 'Hai chú mèo đáng yêu cũng muốn chơi đùa.'
          : `Cùng đọc từ "${targetWords[0] || ''}" thật to và chuẩn xác nào!`,
        tips: 'Mở rộng khẩu hình miệng và giữ nhịp thở đều đặn khi đọc câu vè.',
      },
    ];

    const prompt = `Bạn là Chuyên gia Ngữ âm Tiếng Anh & Trợ lý AI ENjoy dành cho học sinh tiểu học.
Dưới đây là CHÍNH XÁC DANH SÁCH CÁC TỪ BÉ PHÁT ÂM CHƯA ĐÚNG:
${mistakeDetails.length > 0 ? mistakeDetails.join('\n') : `- Danh sách từ cần rèn: [${targetWordsStr}]`}

QUY TẮC BẮT BUỘC:
1. Tất cả các cặp từ tối thiểu (minimalPairs) BẮT BUỘC phải lấy từ các từ bé đã làm sai [${targetWordsStr}] làm từ gốc wordA! (Ví dụ: bé sai "three" thì wordA="three" vs wordB="tree", bé sai "two" thì wordA="two" vs wordB="do" hoặc "to"). TUYỆT ĐỐI KHÔNG tự ý sinh các từ không liên quan như ship/sheep/cat nếu bé không làm sai từ đó!
2. Các câu vè (rhymes) BẮT BUỘC phải chứa trực tiếp các từ bé đã làm sai [${targetWordsStr}] (Ví dụ: "Two little birds count one, two, three.").

Hãy tạo 1 Kế hoạch Luyện Phát Âm Cá Nhân Hóa (JSON) chuẩn mực, thân thiện, dễ hiểu cho bé:
1. "summaryTitle": Tóm tắt điểm ngữ âm bé cần rèn luyện nhất dựa trên các từ [${targetWordsStr}].
2. "mouthShapeTips": Mảng 2-3 mẹo khẩu hình miệng ngắn gọn cho các âm chính trong các từ bé sai.
3. "minimalPairs": Mảng các cặp từ tối thiểu tương phản từ chính các từ [${targetWordsStr}].
4. "rhymes": Mảng 2 câu vè ngắn vui nhộn lồng ghép các từ [${targetWordsStr}].

Trả về DUY NHẤT 1 chuỗi JSON hợp lệ (không kèm markdown \`\`\`json):
{
  "summaryTitle": "Tóm tắt ngắn gọn",
  "mouthShapeTips": [
    {
      "phoneme": "/θ/",
      "title": "Mẹo phát âm âm /θ/ trong 'three'",
      "mouthGuide": "Đặt nhẹ đầu lưỡi vào giữa 2 hàm răng và thổi luồng hơi nhẹ ra ngoài.",
      "visualCue": "Đầu lưỡi kẹp nhẹ • Thổi hơi"
    }
  ],
  "minimalPairs": [
    {
      "id": "pair-1",
      "wordA": "three",
      "ipaA": "/θriː/",
      "transA": "số 3",
      "wordB": "tree",
      "ipaB": "/triː/",
      "transB": "cái cây",
      "focusPhoneme": "/θ/ vs /t/"
    }
  ],
  "rhymes": [
    {
      "id": "rhyme-1",
      "sentence": "Two little birds count one, two, three.",
      "phoneticFocus": "Luyện âm /θ/ trong three và /t/ trong two",
      "translationVi": "Hai chú chim nhỏ đếm một, hai, ba.",
      "tips": "Chú ý phân biệt âm /θ/ thổi hơi ở three và âm /t/ bật hơi ở two."
    }
  ]
}`;

    const context = `Bạn là AI luyện phát âm tiếng Anh ENjoy. Tạo bài học dựa trên đúng các từ: [${targetWordsStr}].`;

    const defaultPlan: SpeakingPersonalizedPlan = {
      summaryTitle: `Rèn luyện phản xạ ngữ âm cho các từ: ${targetWordsStr}`,
      overallScore: Math.round((endingScore + vowelScore + clusterScore + intonationScore) / 4),
      habitStats: [
        {
          category: 'Âm đuôi (/s/, /ed/, /t/)',
          score: endingScore,
          mistakeCount: endingErrors,
          description: endingErrors > 0 ? 'Bé hay quên phát âm âm gió cuối từ' : 'Phát âm âm cuối khá tốt',
        },
        {
          category: 'Cặp nguyên âm & Độ ngân dài',
          score: vowelScore,
          mistakeCount: vowelErrors,
          description: vowelErrors > 0 ? 'Dễ nhầm giữa nguyên âm dài và ngắn' : 'Phát âm nguyên âm chuẩn',
        },
        {
          category: 'Tổ hợp phụ âm (/th/, /sh/, /ch/)',
          score: clusterScore,
          mistakeCount: clusterErrors,
          description: clusterErrors > 0 ? 'Cần chú ý đặt lưỡi khi đọc âm /th/ và /sh/' : 'Khẩu hình phụ âm tốt',
        },
        {
          category: 'Độ trôi chảy & Bật hơi',
          score: intonationScore,
          mistakeCount: generalErrors,
          description: 'Cần tự tin bật hơi rõ ràng từng âm tiết',
        },
      ],
      mouthShapeTips: [
        {
          phoneme: targetWords.includes('three') ? '/θ/ (th)' : '/s/',
          title: targetWords.includes('three') ? 'Mẹo phát âm âm /θ/ trong "three"' : 'Mẹo phát âm âm gió /s/',
          mouthGuide: targetWords.includes('three')
            ? 'Đặt đầu lưỡi chạm nhẹ vào giữa hai hàm răng trên và dưới, sau đó thổi nhẹ luồng hơi ra ngoài.'
            : 'Khép nhẹ hai hàm răng, khóe miệng kéo sang hai bên như đang cười và đẩy luồng hơi xì nhẹ.',
          visualCue: targetWords.includes('three') ? 'Đầu lưỡi kẹp nhẹ giữa 2 răng • Thổi hơi' : 'Răng khép • Cười tươi • Đẩy hơi nhẹ',
        },
        {
          phoneme: targetWords.includes('two') ? '/t/' : '/iː/ vs /ɪ/',
          title: targetWords.includes('two') ? 'Mẹo bật âm /t/ chuẩn trong "two"' : 'Mẹo phân biệt nguyên âm dài & ngắn',
          mouthGuide: targetWords.includes('two')
            ? 'Đặt đầu lưỡi vào vòm họng phía sau răng trên, nén hơi rồi bật dứt khoát ra ngoài.'
            : 'Với nguyên âm dài kéo căng khóe miệng sang 2 bên. Với nguyên âm ngắn thả lỏng miệng và đọc dứt khoát.',
          visualCue: targetWords.includes('two') ? 'Đầu lưỡi chạm nướu trên • Bật dứt khoát' : 'Căng khóe miệng • Âm dứt khoát',
        },
      ],
      minimalPairs: generatedMinimalPairs,
      rhymes: generatedRhymes,
    };

    try {
      const raw = await chatbotApi.ask(prompt, context);
      let cleaned = raw.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned);
      if (parsed.mouthShapeTips && parsed.minimalPairs && parsed.minimalPairs.length > 0 && parsed.rhymes) {
        return {
          summaryTitle: parsed.summaryTitle || defaultPlan.summaryTitle,
          overallScore: defaultPlan.overallScore,
          habitStats: defaultPlan.habitStats,
          mouthShapeTips: parsed.mouthShapeTips,
          minimalPairs: parsed.minimalPairs,
          rhymes: parsed.rhymes,
        };
      }
      return defaultPlan;
    } catch {
      return defaultPlan;
    }
  },
};

export interface AdaptiveChallenge {
  title: string;
  story: string;
  storyVi: string;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export interface PhoneticHabitStat {
  category: string;
  score: number;
  mistakeCount: number;
  description: string;
}

export interface MouthShapeTip {
  phoneme: string;
  title: string;
  mouthGuide: string;
  visualCue: string;
}

export interface MinimalPairItem {
  id: string;
  wordA: string;
  ipaA: string;
  transA: string;
  wordB: string;
  ipaB: string;
  transB: string;
  focusPhoneme: string;
}

export interface RhymeTwisterItem {
  id: string;
  sentence: string;
  phoneticFocus: string;
  translationVi: string;
  tips: string;
}

export interface SpeakingPersonalizedPlan {
  summaryTitle: string;
  overallScore: number;
  habitStats: PhoneticHabitStat[];
  mouthShapeTips: MouthShapeTip[];
  minimalPairs: MinimalPairItem[];
  rhymes: RhymeTwisterItem[];
}

export interface AnalyzedSpeakingItem {
  id: string | number;
  questionId?: string | number;
  word: string;
  ipa: string;
  translation: string;
  imageUrl?: string;
  audioUrl?: string;
  topic?: string;
  recognizedText: string;
  classification: 'COMPLETELY_WRONG' | 'NEAR_CORRECT_PHONEME';
  focusPhoneme?: string;
  phonemeType?: 'consonant' | 'vowel';
  phonemeNameVi?: string;
  videoUrl?: string;
  wrongPhonemeLabel?: string;
  mouthShapeGuide?: string;
  aiAnalysisVi: string;
}

export interface SpeakingDiagnosisResult {
  completelyWrongItems: AnalyzedSpeakingItem[];
  nearCorrectItems: AnalyzedSpeakingItem[];
  summary: string;
}



