package com.example.learningservice.entities;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

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
        if (p.currentToken() == JsonToken.VALUE_STRING) {
            return p.getText();
        }
        if (p.currentToken() == JsonToken.VALUE_NULL) {
            return null;
        }
        JsonNode node = p.readValueAsTree();
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.isTextual()) {
            return node.asText();
        }
        return mapper.writeValueAsString(node);
    }
}
