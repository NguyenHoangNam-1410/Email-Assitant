package com.mail.writer.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailAdjust(EmailRequest emailRequest) {
        // Build prompt
        String prompt = buildPrompt(emailRequest);

        // Craft request
        Map<String, Object> requestBody = Map.of("contents", new Object[] {
                Map.of("parts", new Object[] {
                        Map.of("text", prompt)
                })
        });

        // Do request and get response
        String response = webClient.post().uri(geminiApiUrl + geminiApiKey).header("Content-Type", "application/json").bodyValue(requestBody)
                .retrieve().bodyToMono(String.class).block();

        // Extract and return response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            if (response == null || response.isEmpty()) {
                return "Error: Empty response from API.";
            }
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            JsonNode candidatesNode = rootNode.path("candidates");
            if (candidatesNode.isMissingNode() || !candidatesNode.isArray() || candidatesNode.isEmpty()) {
                return "Error: No candidates found in API response.";
            }
            return candidatesNode.get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Fix this email ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("use a ").append(emailRequest.getTone()).append("tone ");
        }
        prompt.append("for hte following email content. Please don't generate a subject line and no need to say anything outside of the email.");
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        if (emailRequest.getReceiver() != null && !emailRequest.getReceiver().isEmpty()) {
            prompt.append("\nReceiver: \n").append(emailRequest.getReceiver());
        }
        prompt.append("\nIf the original email is unacceptable, please say Cannot fix this email.");
        return prompt.toString();
    }
}
