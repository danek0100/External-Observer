package com.externalobserver.controller;

import com.externalobserver.model.Zettel;
import com.externalobserver.service.ZettelService;
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
@Tag(name = "Zettel", description = "API для работы с документами Zettel")
public class ZettelController {
    private final ZettelService zettelService;

    @Operation(summary = "Получить все документы")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешно получены все документы"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping
    public ResponseEntity<List<Zettel>> getAllZettels() {
        return ResponseEntity.ok(zettelService.getAllZettels());
    }

    @Operation(summary = "Создать новый документ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ успешно создан"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PostMapping
    public ResponseEntity<Zettel> createZettel(
            @Parameter(description = "Данные для создания документа") 
            @Valid @RequestBody ZettelRequest request) {
        return ResponseEntity.ok(zettelService.createZettel(request));
    }

    @Operation(summary = "Обновить существующий документ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ успешно обновлен"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "404", description = "Документ не найден"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Zettel> updateZettel(
            @Parameter(description = "ID документа") 
            @PathVariable String id,
            @Parameter(description = "Данные для обновления документа") 
            @Valid @RequestBody ZettelRequest request) {
        return zettelService.updateZettel(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Удалить документ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ успешно удален"),
        @ApiResponse(responseCode = "404", description = "Документ не найден"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZettel(
            @Parameter(description = "ID документа") 
            @PathVariable String id) {
        zettelService.deleteZettel(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Получить документ по ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ найден"),
        @ApiResponse(responseCode = "404", description = "Документ не найден"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Zettel> getZettelById(
            @Parameter(description = "ID документа") 
            @PathVariable String id) {
        return zettelService.getZettelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Поиск документов по различным критериям")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @PostMapping("/search")
    public ResponseEntity<List<Zettel>> searchZettels(
            @Parameter(description = "Параметры поиска") 
            @RequestBody ZettelSearchRequest searchRequest) {
        return ResponseEntity.ok(zettelService.searchZettels(searchRequest));
    }

    @Operation(summary = "Поиск документов по тегам")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/search/tags")
    public ResponseEntity<List<Zettel>> searchByTags(
            @Parameter(description = "Список тегов для поиска") 
            @RequestParam List<String> tags,
            @Parameter(description = "Если true, документ должен содержать все указанные теги") 
            @RequestParam(defaultValue = "false") boolean matchAll) {
        return ResponseEntity.ok(zettelService.findByTags(tags, matchAll));
    }

    @Operation(summary = "Поиск документов по ключевому слову в контенте")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Поиск выполнен успешно"),
        @ApiResponse(responseCode = "400", description = "Неверный формат запроса"),
        @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    @GetMapping("/search/keyword")
    public ResponseEntity<List<Zettel>> searchByKeyword(
            @Parameter(description = "Ключевое слово для поиска") 
            @RequestParam String keyword) {
        return ResponseEntity.ok(zettelService.findByKeyword(keyword));
    }
} 