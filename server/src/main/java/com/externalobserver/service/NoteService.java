package com.externalobserver.service;

import com.externalobserver.model.Note;
import com.externalobserver.repository.NoteRepository;
import com.externalobserver.dto.ZettelSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<Note> getAllNotes() {
        return noteRepository.findByUsername(getCurrentUsername());
    }

    @Transactional
    public Note createNote(Note note) {
        note.setCreated(LocalDateTime.now());
        note.setUpdated(LocalDateTime.now());
        note.setVersion(1);
        note.setUsername(getCurrentUsername());
        return noteRepository.save(note);
    }

    @Transactional
    public Optional<Note> updateNote(String id, Note note) {
        return noteRepository.findByIdAndUsername(id, getCurrentUsername()).map(existingNote -> {
            note.setId(id);
            note.setCreated(existingNote.getCreated());
            note.setUpdated(LocalDateTime.now());
            note.setVersion(existingNote.getVersion() + 1);
            note.setUsername(getCurrentUsername());
            return noteRepository.save(note);
        });
    }

    @Transactional
    public void deleteNote(String id) {
        noteRepository.deleteByIdAndUsername(id, getCurrentUsername());
    }

    public Optional<Note> getNoteById(String id) {
        return noteRepository.findByIdAndUsername(id, getCurrentUsername());
    }

    public List<Note> findByTags(List<String> tags, boolean matchAll) {
        if (matchAll) {
            return noteRepository.findByTagsInAndUsername(tags, getCurrentUsername());
        }
        return noteRepository.findByTagsInAndUsername(tags, getCurrentUsername());
    }

    public List<Note> findByKeyword(String keyword) {
        return noteRepository.findByContentContainingIgnoreCaseAndUsername(keyword, getCurrentUsername());
    }

    public List<Note> searchNotes(ZettelSearchRequest searchRequest) {
        if (searchRequest.getTags() != null && !searchRequest.getTags().isEmpty()) {
            return noteRepository.findByTagsInOrContentContainingIgnoreCase(
                searchRequest.getTags(),
                searchRequest.getKeyword()
            );
        }
        return noteRepository.findByContentContainingIgnoreCase(searchRequest.getKeyword());
    }
} 