package com.example.learningservice.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteResult {
    private boolean deleted;
    private boolean requiresConfirmation;
    private String confirmationToken;
    private long affectedStudentCount;
    private int bridgedUnlockCount;
    private String message;

    public static DeleteResult success(String message, long affectedStudentCount, int bridgedUnlockCount) {
        return DeleteResult.builder()
                .deleted(true)
                .requiresConfirmation(false)
                .affectedStudentCount(affectedStudentCount)
                .bridgedUnlockCount(bridgedUnlockCount)
                .message(message)
                .build();
    }

    public static DeleteResult needConfirmation(String message, String token, long affectedStudentCount) {
        return DeleteResult.builder()
                .deleted(false)
                .requiresConfirmation(true)
                .confirmationToken(token)
                .affectedStudentCount(affectedStudentCount)
                .bridgedUnlockCount(0)
                .message(message)
                .build();
    }
}
