package edu.iuh.fit.chatbot_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Service sinh câu thử thách ngữ pháp cho Vocab Practice.
 *
 * Flow RAG hoàn chỉnh:
 * 1. Frontend gửi {word, topic, avoidGrammarName}
 * 2. GrammarRAGService query Qdrant → trả về top-K cấu trúc ngữ pháp phù hợp nhất
 * 3. Inject context vào system prompt → Ollama tự chọn + sinh câu
 * 4. Trả về JSON cho frontend tự hole-punch
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GrammarChallengeService {

    private final ChatClient chatClient;
    private final GrammarRAGService grammarRAGService;

    /**
     * Sinh câu thử thách ngữ pháp qua RAG pipeline.
     *
     * @param word              Từ vựng mục tiêu
     * @param topic             Chủ đề
     * @param avoidGrammarName  Ngữ pháp cần tránh (đa dạng hóa khi "Đổi câu khác")
     * @return JSON string chứa fullSentence, grammarPart, options, translation...
     */
    public String generateGrammarChallenge(String word, String topic, String avoidGrammarName) {
        // 1. RAG: Truy vấn Qdrant lấy cấu trúc ngữ pháp phù hợp nhất
        String grammarContext = grammarRAGService.getGrammarContext(word, topic, avoidGrammarName);

        if (grammarContext.isBlank()) {
            log.warn("⚠️ Qdrant trả về rỗng, dùng prompt không RAG");
            grammarContext = "Hãy tự chọn 1 cấu trúc ngữ pháp Pre-A1 Starters phù hợp.";
        }

        // 2. Random seed để tránh AI trả về kết quả lặp
        int randomSeed = new java.util.Random().nextInt(10000);

        // 3. System prompt với grammar context từ RAG
        String systemPrompt = String.format(
            """
            Bạn là chuyên gia sư phạm tiếng Anh Cambridge Pre-A1 Starters cho trẻ em 5-8 tuổi.
            
            Dưới đây là các cấu trúc ngữ pháp được hệ thống RAG (Qdrant Vector DB) chọn ra là PHÙ HỢP NHẤT với từ vựng và chủ đề:
            
            %s
            
            QUY TẮC TUYỆT ĐỐI:
            - Chọn 1 trong các cấu trúc trên, ưu tiên cấu trúc phù hợp ngữ nghĩa nhất với từ vựng.
            - Câu phải ĐƠN GIẢN (5-10 từ), đúng ngữ pháp 100%%, tự nhiên cho trẻ em.
            - Bản dịch và gợi ý phải 100%% tiếng Việt có dấu. CẤM chữ Hán/Hàn/Nhật.
            - CHỈ trả về JSON thuần túy, KHÔNG markdown code fence.
            """, grammarContext
        );

        // 4. User prompt
        String avoidInstruction = (avoidGrammarName != null && !avoidGrammarName.isBlank())
            ? String.format("⚠️ KHÔNG ĐƯỢC chọn cấu trúc \"%s\". Hãy chọn cấu trúc KHÁC hoàn toàn.", avoidGrammarName)
            : "";

        String userPrompt = String.format(
            """
            [Seed: %d] Từ vựng: "%s" — Chủ đề: "%s"
            %s
            
            NHIỆM VỤ:
            1. Chọn 1 cấu trúc ngữ pháp PHÙ HỢP NHẤT từ danh sách RAG ở trên.
            2. Viết 1 câu tiếng Anh ĐẦY ĐỦ (không chỗ trống), ngắn gọn, tự nhiên, chứa từ "%s".
            3. Xác định CHÍNH XÁC phần ngữ pháp (grammarPart) cần đục lỗ.
            4. Tạo 3 đáp án sai (grammarWrong) — cùng loại, dễ nhầm.
            5. Tạo 3 từ vựng nhiễu (vocabWrong) — cùng chủ đề "%s".
            
            Trả về DUY NHẤT JSON:
            {
              "grammarName": "Tên cấu trúc đã chọn",
              "fullSentence": "Câu tiếng Anh đầy đủ",
              "grammarPart": "Phần ngữ pháp cần đục lỗ",
              "grammarWrong": ["sai1", "sai2", "sai3"],
              "vocabWrong": ["từ nhiễu 1", "từ nhiễu 2", "từ nhiễu 3"],
              "translation": "Dịch tiếng Việt đầy đủ",
              "hint": "Gợi ý ngắn bằng tiếng Việt"
            }
            """, randomSeed, word, topic, avoidInstruction, word, topic
        );

        try {
            log.info("🧠 GrammarChallenge: word=\"{}\", topic=\"{}\", seed={}", word, topic, randomSeed);

            String response = chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();

            log.info("📥 GrammarChallenge AI response: {}", response);

            return (response != null && !response.isBlank()) ? response.strip() : "{}";
        } catch (Exception e) {
            log.error("❌ Lỗi GrammarChallenge:", e);
            return "{}";
        }
    }
}
