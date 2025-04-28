package com.externalobserver.service;

import com.externalobserver.model.Note;
import com.externalobserver.repository.NoteRepository;
import com.externalobserver.dto.ZettelRequest;
import com.externalobserver.dto.ZettelSearchRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    private NoteService noteService;

    private Note testNote;
    private ZettelRequest testRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        noteService = new NoteService(noteRepository);

        testNote = new Note();
        testNote.setId("test-id");
        testNote.setTitle("Test Note");
        testNote.setContent("Test content");
        testNote.setTags(Arrays.asList("test", "unit"));
        testNote.setCreated(LocalDateTime.now());
        testNote.setVersion(1);

        testRequest = new ZettelRequest();
        testRequest.setType("zettel");
        testRequest.setContent("Test content");
        testRequest.setTags(Arrays.asList("test", "unit"));
    }

    @Test
    void getAllNotes_ShouldReturnAllNotes() {
        when(noteRepository.findAll()).thenReturn(Arrays.asList(testNote));
        
        List<Note> result = noteService.getAllNotes();
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testNote.getId(), result.get(0).getId());
        verify(noteRepository).findAll();
    }

    @Test
    void createNote_ShouldSaveAndReturnNote() {
        when(noteRepository.save(any(Note.class))).thenReturn(testNote);
        
        Note result = noteService.createNote(testNote);
        
        assertNotNull(result);
        assertEquals(testNote.getId(), result.getId());
        assertEquals(testNote.getTitle(), result.getTitle());
        assertEquals(testNote.getContent(), result.getContent());
        verify(noteRepository).save(any(Note.class));
    }

    @Test
    void updateNote_WhenNoteExists_ShouldUpdateAndReturnNote() {
        when(noteRepository.findById(testNote.getId())).thenReturn(Optional.of(testNote));
        when(noteRepository.save(any(Note.class))).thenReturn(testNote);
        
        Optional<Note> result = noteService.updateNote(testNote.getId(), testNote);
        
        assertTrue(result.isPresent());
        assertEquals(testNote.getId(), result.get().getId());
        verify(noteRepository).findById(testNote.getId());
        verify(noteRepository).save(any(Note.class));
    }

    @Test
    void updateNote_WhenNoteDoesNotExist_ShouldReturnEmpty() {
        when(noteRepository.findById("non-existent")).thenReturn(Optional.empty());
        
        Optional<Note> result = noteService.updateNote("non-existent", testNote);
        
        assertTrue(result.isEmpty());
        verify(noteRepository).findById("non-existent");
        verify(noteRepository, never()).save(any(Note.class));
    }

    @Test
    void deleteNote_ShouldCallRepositoryDelete() {
        doNothing().when(noteRepository).deleteById(testNote.getId());
        
        noteService.deleteNote(testNote.getId());
        
        verify(noteRepository).deleteById(testNote.getId());
    }

    @Test
    void getNoteById_WhenNoteExists_ShouldReturnNote() {
        when(noteRepository.findById(testNote.getId())).thenReturn(Optional.of(testNote));
        
        Optional<Note> result = noteService.getNoteById(testNote.getId());
        
        assertTrue(result.isPresent());
        assertEquals(testNote.getId(), result.get().getId());
        verify(noteRepository).findById(testNote.getId());
    }

    @Test
    void getNoteById_WhenNoteDoesNotExist_ShouldReturnEmpty() {
        when(noteRepository.findById("non-existent")).thenReturn(Optional.empty());
        
        Optional<Note> result = noteService.getNoteById("non-existent");
        
        assertTrue(result.isEmpty());
        verify(noteRepository).findById("non-existent");
    }

    @Test
    void searchNotes_WithTagsAndKeyword_ShouldReturnMatchingNotes() {
        ZettelSearchRequest searchRequest = new ZettelSearchRequest();
        searchRequest.setTags(Arrays.asList("test"));
        searchRequest.setKeyword("content");
        
        when(noteRepository.findByTagsInOrContentContainingIgnoreCase(
            anyList(), anyString())).thenReturn(Arrays.asList(testNote));
        
        List<Note> result = noteService.searchNotes(searchRequest);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testNote.getId(), result.get(0).getId());
        verify(noteRepository).findByTagsInOrContentContainingIgnoreCase(
            searchRequest.getTags(), searchRequest.getKeyword());
    }
} 