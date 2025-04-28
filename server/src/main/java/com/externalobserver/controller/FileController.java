package com.externalobserver.controller;

import com.externalobserver.model.Note;
import com.externalobserver.service.FileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/import")
    public ResponseEntity<List<Note>> importMarkdownFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<Note> importedNotes = fileService.importMarkdownFiles(files);
            return ResponseEntity.ok(importedNotes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/export")
    public ResponseEntity<ByteArrayResource> exportNotesAsZip() {
        try {
            byte[] zipBytes = fileService.exportNotesAsZip();
            ByteArrayResource resource = new ByteArrayResource(zipBytes);

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=notes.zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(zipBytes.length)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 