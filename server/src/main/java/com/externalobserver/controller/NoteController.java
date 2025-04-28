package com.externalobserver.controller;

import com.externalobserver.model.Note;
import com.externalobserver.service.NoteService;
import com.externalobserver.dto.ZettelRequest;
import com.externalobserver.dto.ZettelSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@Tag(name = "Note", description = "API для работы с заметками")
public class NoteController {
    private final NoteService noteService;

    @Operation(summary = "Получить все заметки")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешно получены все заметки"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @Operation(summary = "Создать новую заметку")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Заметка успешно создана"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        return ResponseEntity.ok(noteService.createNote(note));
    }

    @Operation(summary = "Обновить существующую заметку")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Заметка успешно обновлена"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "404", description = "Заметка не найдена"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable String id, @RequestBody Note note) {
        return noteService.updateNote(id, note)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Удалить заметку")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Заметка успешно удалена"),
        @ApiResponse(responseCode = "404", description = "Заметка не найдена"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Получить заметку по ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Заметка найдена"),
        @ApiResponse(responseCode = "404", description = "Заметка не найдена"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable String id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Поиск заметок по различным критериям")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PostMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(
            @Parameter(description = "Параметры поиска") 
            @RequestBody ZettelSearchRequest searchRequest) {
        return ResponseEntity.ok(noteService.searchNotes(searchRequest));
    }

    @Operation(summary = "Поиск заметок по тегам")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/search/tags")
    public ResponseEntity<List<Note>> searchByTags(
            @Parameter(description = "Список тегов для поиска") 
            @RequestParam List<String> tags,
            @Parameter(description = "Если true, заметка должна содержать все указанные теги") 
            @RequestParam(defaultValue = "false") boolean matchAll) {
        return ResponseEntity.ok(noteService.findByTags(tags, matchAll));
    }

    @Operation(summary = "Поиск заметок по ключевому слову в контенте")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/search/keyword")
    public ResponseEntity<List<Note>> searchByKeyword(
            @Parameter(description = "Ключевое слово для поиска") 
            @RequestParam String keyword) {
        return ResponseEntity.ok(noteService.findByKeyword(keyword));
    }
} 