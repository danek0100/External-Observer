package com.externalobserver.controller;

import com.externalobserver.model.Note;
import com.externalobserver.repository.NoteRepository;
import com.externalobserver.config.TestSecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class NoteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NoteRepository noteRepository;

    private Note testNote;

    @BeforeEach
    void setUp() {
        noteRepository.deleteAll();

        testNote = new Note();
        testNote.setTitle("Test Note");
        testNote.setContent("Test Content");
        testNote.setTags(Arrays.asList("test", "integration"));
        testNote.setCreated(LocalDateTime.now());
        testNote.setUpdated(LocalDateTime.now());
        testNote.setVersion(1);
        testNote = noteRepository.save(testNote);
    }

    @Test
    void getAllNotes_ShouldReturnAllNotes() throws Exception {
        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testNote.getId())))
                .andExpect(jsonPath("$[0].title", is(testNote.getTitle())));
    }

    @Test
    void getNoteById_WhenNoteExists_ShouldReturnNote() throws Exception {
        mockMvc.perform(get("/api/notes/" + testNote.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testNote.getId())))
                .andExpect(jsonPath("$.title", is(testNote.getTitle())));
    }

    @Test
    void getNoteById_WhenNoteDoesNotExist_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/notes/non-existent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createNote_ShouldCreateAndReturnNote() throws Exception {
        Note newNote = new Note();
        newNote.setTitle("New Note");
        newNote.setContent("New Content");

        mockMvc.perform(post("/api/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newNote)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(newNote.getTitle())))
                .andExpect(jsonPath("$.content", is(newNote.getContent())));
    }

    @Test
    void updateNote_WhenNoteExists_ShouldUpdateAndReturnNote() throws Exception {
        testNote.setTitle("Updated Title");

        mockMvc.perform(put("/api/notes/" + testNote.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testNote)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")));
    }

    @Test
    void updateNote_WhenNoteDoesNotExist_ShouldReturn404() throws Exception {
        mockMvc.perform(put("/api/notes/non-existent")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testNote)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteNote_WhenNoteExists_ShouldDeleteNote() throws Exception {
        mockMvc.perform(delete("/api/notes/" + testNote.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notes/" + testNote.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchByTags_ShouldReturnMatchingNotes() throws Exception {
        mockMvc.perform(get("/api/notes/search/tags")
                .param("tags", "test")
                .param("matchAll", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testNote.getId())));
    }

    @Test
    void searchByKeyword_ShouldReturnMatchingNotes() throws Exception {
        mockMvc.perform(get("/api/notes/search/keyword")
                .param("keyword", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testNote.getId())));
    }
} 