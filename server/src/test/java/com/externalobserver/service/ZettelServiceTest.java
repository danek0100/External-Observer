package com.externalobserver.service;

import com.externalobserver.model.Zettel;
import com.externalobserver.repository.ZettelRepository;
import com.externalobserver.dto.ZettelRequest;
import com.externalobserver.dto.ZettelSearchRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ZettelServiceTest {

    @Mock
    private ZettelRepository zettelRepository;

    @InjectMocks
    private ZettelService zettelService;

    private Zettel testZettel;
    private ZettelRequest testRequest;

    @BeforeEach
    void setUp() {
        testZettel = new Zettel();
        testZettel.setId("test-id");
        testZettel.setType("zettel");
        testZettel.setContent("Test content");
        testZettel.setTags(Arrays.asList("test", "unit"));
        testZettel.setCreated(LocalDateTime.now());
        testZettel.setVersion(1);

        testRequest = new ZettelRequest();
        testRequest.setType("zettel");
        testRequest.setContent("Test content");
        testRequest.setTags(Arrays.asList("test", "unit"));
    }

    @Test
    void getAllZettels_ShouldReturnAllZettels() {
        when(zettelRepository.findAll()).thenReturn(Arrays.asList(testZettel));
        
        List<Zettel> result = zettelService.getAllZettels();
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testZettel.getId(), result.get(0).getId());
        verify(zettelRepository).findAll();
    }

    @Test
    void createZettel_ShouldCreateNewZettel() {
        when(zettelRepository.save(any(Zettel.class))).thenReturn(testZettel);
        
        Zettel result = zettelService.createZettel(testRequest);
        
        assertNotNull(result);
        assertEquals(testZettel.getId(), result.getId());
        assertEquals(testZettel.getType(), result.getType());
        assertEquals(testZettel.getContent(), result.getContent());
        verify(zettelRepository).save(any(Zettel.class));
    }

    @Test
    void updateZettel_WhenZettelExists_ShouldUpdateZettel() {
        when(zettelRepository.findById(testZettel.getId())).thenReturn(Optional.of(testZettel));
        when(zettelRepository.save(any(Zettel.class))).thenReturn(testZettel);
        
        Optional<Zettel> result = zettelService.updateZettel(testZettel.getId(), testRequest);
        
        assertTrue(result.isPresent());
        assertEquals(testZettel.getId(), result.get().getId());
        verify(zettelRepository).findById(testZettel.getId());
        verify(zettelRepository).save(any(Zettel.class));
    }

    @Test
    void updateZettel_WhenZettelDoesNotExist_ShouldReturnEmpty() {
        when(zettelRepository.findById("non-existent")).thenReturn(Optional.empty());
        
        Optional<Zettel> result = zettelService.updateZettel("non-existent", testRequest);
        
        assertTrue(result.isEmpty());
        verify(zettelRepository).findById("non-existent");
        verify(zettelRepository, never()).save(any(Zettel.class));
    }

    @Test
    void deleteZettel_ShouldDeleteZettel() {
        doNothing().when(zettelRepository).deleteById(testZettel.getId());
        
        zettelService.deleteZettel(testZettel.getId());
        
        verify(zettelRepository).deleteById(testZettel.getId());
    }

    @Test
    void getZettelById_WhenZettelExists_ShouldReturnZettel() {
        when(zettelRepository.findById(testZettel.getId())).thenReturn(Optional.of(testZettel));
        
        Optional<Zettel> result = zettelService.getZettelById(testZettel.getId());
        
        assertTrue(result.isPresent());
        assertEquals(testZettel.getId(), result.get().getId());
        verify(zettelRepository).findById(testZettel.getId());
    }

    @Test
    void searchZettels_WithTagsAndKeyword_ShouldReturnMatchingZettels() {
        ZettelSearchRequest searchRequest = new ZettelSearchRequest();
        searchRequest.setTags(Arrays.asList("test"));
        searchRequest.setKeyword("content");
        
        when(zettelRepository.findByTagsInOrContentContainingIgnoreCase(
            anyList(), anyString())).thenReturn(Arrays.asList(testZettel));
        
        List<Zettel> result = zettelService.searchZettels(searchRequest);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testZettel.getId(), result.get(0).getId());
        verify(zettelRepository).findByTagsInOrContentContainingIgnoreCase(
            searchRequest.getTags(), searchRequest.getKeyword());
    }
} 