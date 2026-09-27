package com.example.learningservice.entities;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * Deserializer: khi nhận JSON object từ request body cho trường payload,
 * serialize nó về String để lưu vào DB (JSON column).
 */
public class RawJsonDeserializer extends StdDeserializer<String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    public RawJsonDeserializer() {
        super(String.class);
    }

    @Override
    public String deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        // Đọc toàn bộ JSON node và convert về String
        return mapper.writeValueAsString(p.readValueAsTree());
    }
}
