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
};
