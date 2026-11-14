package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Part;
import com.example.learningservice.entities.Session;
import com.example.learningservice.entities.enums.SessionType;
import com.example.learningservice.repositories.PartRepository;
import com.example.learningservice.repositories.SessionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Session Service Unit Tests")
class SessionServiceImplTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private PartRepository partRepository;

    @InjectMocks
    private SessionServiceImpl sessionService;

    /**
     * Verifies that sessions are fetched using the repository query for visible sessions in a part.
     */
    @Test
    @DisplayName("getSessionsByPart: Lấy danh sách session theo part")
    void getSessionsByPart_always_delegatesToRepositoryFilteredQuery() {
        // Arrange
        Long partId = 5L;
        List<Session> sessions = List.of(session(1L, "Session 1"), session(2L, "Session 2"));
        when(sessionRepository.findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(partId))
                .thenReturn(sessions);

        // Act
        List<Session> result = sessionService.getSessionsByPart(partId);

        // Assert
        assertThat(result).isSameAs(sessions);
        verify(sessionRepository)
                .findByPartIdAndIsDeleteFalseAndIsPublishedTrueOrderByOrderIndexAsc(partId);
    }

    /**
     * Verifies that an existing non-deleted session is returned by ID.
     */
    @Test
    @DisplayName("getSessionById: Trả về session đang tồn tại và chưa xóa")
    void getSessionById_existingNonDeletedId_returnsSession() {
        // Arrange
        Long sessionId = 7L;
        Session expected = session(sessionId, "Existing session");
        when(sessionRepository.findByIdAndIsDeleteFalse(sessionId)).thenReturn(Optional.of(expected));

        // Act
        Session result = sessionService.getSessionById(sessionId);

        // Assert
        assertThat(result).isSameAs(expected);
        verify(sessionRepository).findByIdAndIsDeleteFalse(sessionId);
    }

    /**
     * Verifies that creating a session associates its part and initializes its timestamp and delete flag.
     */
    @Test
    @DisplayName("createSession: Gán part, thời gian tạo và lưu session")
    void createSession_validPartId_setsPartAndTimestampAndSaves() {
        // Arrange
        Long partId = 5L;
        Part part = Part.builder().id(partId).title("Part 1").build();
        Session newSession = session(null, "New session");
        when(partRepository.findByIdAndIsDeleteFalse(partId)).thenReturn(Optional.of(part));
        when(sessionRepository.save(newSession)).thenReturn(newSession);

        // Act
        Session result = sessionService.createSession(partId, newSession);

        // Assert
        assertThat(result).isSameAs(newSession);
        assertThat(newSession.getPart()).isSameAs(part);
        assertThat(newSession.getCreateAt()).isNotNull();
        assertThat(newSession.getIsDelete()).isFalse();
        verify(sessionRepository).save(newSession);
    }

    /**
     * Verifies that creating a session for a missing or deleted part throws an exception.
     */
    @Test
    @DisplayName("createSession: Báo lỗi khi part không tồn tại hoặc đã xóa")
    void createSession_partDeleted_throwsRuntimeException() {
        // Arrange
        Long partId = 5L;
        Session newSession = session(null, "New session");
        when(partRepository.findByIdAndIsDeleteFalse(partId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sessionService.createSession(partId, newSession))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Part không tồn tại hoặc đã bị xóa!");
    }

    /**
     * Verifies that all supported session fields are copied and the updated entity is saved.
     */
    @Test
    @DisplayName("updateSession: Cập nhật các trường session và lưu")
    void updateSession_existingSession_updatesAllFieldsAndSaves() {
        // Arrange
        Long sessionId = 7L;
        Session existing = Session.builder()
                .id(sessionId)
                .title("Old title")
                .description("Old description")
                .orderIndex(1)
                .sessionType(SessionType.FLASHCARD)
                .payload("{\"old\":true}")
                .build();
        Session changes = Session.builder()
                .title("Updated title")
                .description("Updated description")
                .orderIndex(3)
                .sessionType(SessionType.GRAMMAR)
                .payload("{\"updated\":true}")
                .build();
        when(sessionRepository.findByIdAndIsDeleteFalse(sessionId)).thenReturn(Optional.of(existing));
        when(sessionRepository.save(existing)).thenReturn(existing);

        // Act
        Session result = sessionService.updateSession(sessionId, changes);

        // Assert
        assertThat(result).isSameAs(existing);
        assertThat(existing.getTitle()).isEqualTo("Updated title");
        assertThat(existing.getDescription()).isEqualTo("Updated description");
        assertThat(existing.getOrderIndex()).isEqualTo(3);
        assertThat(existing.getSessionType()).isEqualTo(SessionType.GRAMMAR);
        assertThat(existing.getPayload()).isEqualTo("{\"updated\":true}");
        assertThat(existing.getUpdateAt()).isNotNull();
        verify(sessionRepository).save(existing);
    }

    /**
     * Verifies that deleting a session performs a soft delete and saves the entity.
     */
    @Test
    @DisplayName("deleteSession: Đánh dấu session đã xóa mềm và lưu")
    void deleteSession_existingSession_setsIsDeleteTrueAndSaves() {
        // Arrange
        Long sessionId = 7L;
        Session existing = session(sessionId, "Session to delete");
        when(sessionRepository.findByIdAndIsDeleteFalse(sessionId)).thenReturn(Optional.of(existing));
        when(sessionRepository.save(existing)).thenReturn(existing);

        // Act
        sessionService.deleteSession(sessionId);

        // Assert
        assertThat(existing.getIsDelete()).isTrue();
        assertThat(existing.getUpdateAt()).isNotNull();
        verify(sessionRepository).save(existing);
    }

    private Session session(Long id, String title) {
        Session session = Session.builder()
                .id(id)
                .title(title)
                .description("Session description")
                .orderIndex(1)
                .sessionType(SessionType.FLASHCARD)
                .payload("{\"items\":[]}")
                .build();
        session.setIsDelete(false);
        return session;
    }
}
