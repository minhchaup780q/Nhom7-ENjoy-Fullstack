package edu.iuh.fit.chatbot_service.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service RAG (Retrieval-Augmented Generation) cho Grammar docs.
 *
 * Khi khởi động:
 * 1. Đọc file grammar.text từ classpath
 * 2. Tách thành 22 chunk (mỗi cấu trúc ngữ pháp = 1 document)
 * 3. Embed bằng Ollama nomic-embed-text → lưu vào Qdrant
 *
 * Khi query:
 * - Nhận từ vựng + chủ đề → tìm top-K cấu trúc ngữ pháp phù hợp nhất
 * - Trả về context string để inject vào prompt AI
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GrammarRAGService {

    private final VectorStore vectorStore;

    private boolean initialized = false;

    @PostConstruct
    public void init() {
        try {
            loadGrammarDocs();
            initialized = true;
            log.info("✅ GrammarRAGService: Đã nạp grammar docs vào Qdrant Vector Store thành công!");
        } catch (Exception e) {
            log.error("❌ GrammarRAGService: Lỗi khi nạp grammar docs vào Qdrant", e);
        }
    }

    /**
     * Đọc grammar.text, tách thành 22 chunk, embed & lưu Qdrant.
     */
    private void loadGrammarDocs() throws Exception {
        ClassPathResource resource = new ClassPathResource("grammar.text");

        String fullText;
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            fullText = reader.lines().collect(Collectors.joining("\n"));
        }

        // Tách theo pattern "số/" (1/, 2/, ..., 22/)
        String[] chunks = fullText.split("(?=\\d+/)");

        List<Document> documents = new ArrayList<>();
        for (String chunk : chunks) {
            String trimmed = chunk.trim();
            if (trimmed.isEmpty() || !trimmed.matches("^\\d+/.*")) {
                continue;
            }

            // Trích xuất tên ngữ pháp từ dòng đầu
            String firstLine = trimmed.split("\n")[0].trim();
            // Ví dụ: "19/ Tên ngữ pháp: There is/There are"
            String grammarName = firstLine.replaceFirst("^\\d+/\\s*(Tên ngữ pháp:\\s*)?", "").trim();

            // Trích xuất ID
            String idStr = trimmed.split("/")[0].trim();

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("grammarId", idStr);
            metadata.put("grammarName", grammarName);
            metadata.put("source", "grammar.text");

            Document doc = new Document(trimmed, metadata);
            documents.add(doc);
        }

        if (!documents.isEmpty()) {
            log.info("📚 GrammarRAGService: Đang embed {} cấu trúc ngữ pháp vào Qdrant...", documents.size());
            vectorStore.add(documents);
            log.info("📚 GrammarRAGService: Embed thành công {} documents", documents.size());
        } else {
            log.warn("⚠️ GrammarRAGService: Không tìm thấy cấu trúc ngữ pháp nào trong grammar.text");
        }
    }

    /**
     * Truy vấn Qdrant để lấy top-K cấu trúc ngữ pháp phù hợp với từ vựng + chủ đề.
     *
     * @param word  Từ vựng mục tiêu (vd: "sun", "cat")
     * @param topic Chủ đề (vd: "THE WORLD AROUND US")
     * @param avoidGrammarName Tên ngữ pháp cần tránh (để đa dạng khi bấm "Đổi câu khác")
     * @param topK  Số lượng kết quả trả về
     * @return Chuỗi context chứa các cấu trúc ngữ pháp phù hợp nhất
     */
    public String queryRelevantGrammar(String word, String topic, String avoidGrammarName, int topK) {
        if (!initialized) {
            log.warn("⚠️ GrammarRAGService chưa initialized, trả về empty context");
            return "";
        }

        // Tạo query string kết hợp từ vựng + chủ đề để tìm ngữ pháp phù hợp
        String queryText = String.format(
            "English grammar structure suitable for the word \"%s\" in topic \"%s\". " +
            "Create a simple sentence for children using this word.",
            word, topic
        );

        try {
            List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query(queryText)
                    .topK(topK + 2) // Lấy thêm để có buffer nếu cần filter
                    .build()
            );

            if (results == null || results.isEmpty()) {
                log.warn("⚠️ Qdrant trả về 0 kết quả cho query: {}", queryText);
                return "";
            }

            // Filter bỏ grammar cần tránh (nếu có)
            List<Document> filtered = results;
            if (avoidGrammarName != null && !avoidGrammarName.isBlank()) {
                final String avoidLower = avoidGrammarName.toLowerCase();
                filtered = results.stream()
                    .filter(doc -> {
                        Object name = doc.getMetadata().get("grammarName");
                        return name == null || !name.toString().toLowerCase().contains(avoidLower);
                    })
                    .limit(topK)
                    .collect(Collectors.toList());

                if (filtered.isEmpty()) {
                    // Nếu filter quá mạnh, dùng lại toàn bộ
                    filtered = results.stream().limit(topK).collect(Collectors.toList());
                }
            } else {
                filtered = results.stream().limit(topK).collect(Collectors.toList());
            }

            // Build context string
            StringBuilder sb = new StringBuilder();
            sb.append("CÁC CẤU TRÚC NGỮ PHÁP PHÙ HỢP NHẤT (từ Qdrant Vector DB):\n\n");
            for (Document doc : filtered) {
                sb.append(doc.getText()).append("\n\n");
            }

            log.info("🔍 GrammarRAG: Tìm thấy {} cấu trúc phù hợp cho từ \"{}\"", filtered.size(), word);
            return sb.toString();
        } catch (Exception e) {
            log.error("❌ Lỗi khi query Qdrant:", e);
            return "";
        }
    }

    /**
     * Lấy toàn bộ context (top 3-5 cấu trúc phù hợp nhất).
     */
    public String getGrammarContext(String word, String topic, String avoidGrammarName) {
        return queryRelevantGrammar(word, topic, avoidGrammarName, 5);
    }
}
