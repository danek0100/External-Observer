package com.externalobserver.controller;

import com.externalobserver.model.Zettel;
import com.externalobserver.repository.ZettelRepository;
import com.externalobserver.dto.ZettelRequest;
import com.externalobserver.dto.ZettelSearchRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.time.LocalDateTime;
import java.util.Arrays;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ZettelControllerIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ZettelRepository zettelRepository;

    private Zettel testZettel;
    private ZettelRequest testRequest;

    @BeforeEach
    void setUp() {
        zettelRepository.deleteAll();

        testZettel = new Zettel();
        testZettel.setId("test-id");
        testZettel.setType("zettel");
        testZettel.setContent("Test content");
        testZettel.setTags(Arrays.asList("test", "integration"));
        testZettel.setCreated(LocalDateTime.now());
        testZettel.setVersion(1);
        zettelRepository.save(testZettel);

        testRequest = new ZettelRequest();
        testRequest.setType("zettel");
        testRequest.setContent("Test content");
        testRequest.setTags(Arrays.asList("test", "integration"));
    }

    @Test
    void getAllZettels_ShouldReturnAllZettels() throws Exception {
        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testZettel.getId())))
                .andExpect(jsonPath("$[0].type", is(testZettel.getType())))
                .andExpect(jsonPath("$[0].content", is(testZettel.getContent())));
    }

    @Test
    void createZettel_ShouldCreateNewZettel() throws Exception {
        mockMvc.perform(post("/api/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type", is(testRequest.getType())))
                .andExpect(jsonPath("$.content", is(testRequest.getContent())))
                .andExpect(jsonPath("$.tags", hasSize(2)));
    }

    @Test
    void updateZettel_WhenZettelExists_ShouldUpdateZettel() throws Exception {
        testRequest.setContent("Updated content");

        mockMvc.perform(put("/api/notes/" + testZettel.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is("Updated content")));
    }

    @Test
    void updateZettel_WhenZettelDoesNotExist_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(put("/api/notes/non-existent")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteZettel_ShouldDeleteZettel() throws Exception {
        mockMvc.perform(delete("/api/notes/" + testZettel.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notes/" + testZettel.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchZettels_WithTagsAndKeyword_ShouldReturnMatchingZettels() throws Exception {
        ZettelSearchRequest searchRequest = new ZettelSearchRequest();
        searchRequest.setTags(Arrays.asList("test"));
        searchRequest.setKeyword("content");

        mockMvc.perform(post("/api/notes/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(searchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testZettel.getId())));
    }

    @Test
    void searchByTags_ShouldReturnMatchingZettels() throws Exception {
        mockMvc.perform(get("/api/notes/search/tags")
                .param("tags", "test")
                .param("matchAll", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testZettel.getId())));
    }

    @Test
    void searchByKeyword_ShouldReturnMatchingZettels() throws Exception {
        mockMvc.perform(get("/api/notes/search/keyword")
                .param("keyword", "content"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(testZettel.getId())));
    }
} 