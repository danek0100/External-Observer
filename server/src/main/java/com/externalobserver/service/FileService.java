package com.externalobserver.service;

import com.externalobserver.model.Note;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileService {
    private final ObjectMapper objectMapper;
    private final NoteService noteService;

    public FileService(ObjectMapper objectMapper, NoteService noteService) {
        this.objectMapper = objectMapper;
        this.noteService = noteService;
    }

    public List<Note> importMarkdownFiles(MultipartFile[] files) throws IOException {
        List<Note> importedNotes = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (file.getOriginalFilename().endsWith(".md")) {
                String content = new String(file.getBytes());
                String title = file.getOriginalFilename().replace(".md", "");
                
                Note note = new Note();
                note.setTitle(title);
                note.setContent(content);
                
                Note savedNote = noteService.createNote(note);
                importedNotes.add(savedNote);
            }
        }
        
        return importedNotes;
    }

    public byte[] exportNotesAsZip() throws IOException {
        List<Note> notes = noteService.getAllNotes();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // Создаем структуру директорий
            for (Note note : notes) {
                String path = note.getTitle() + ".md";
                ZipEntry entry = new ZipEntry(path);
                zos.putNextEntry(entry);
                
                // Записываем содержимое заметки
                zos.write(note.getContent().getBytes());
                zos.closeEntry();
            }
            
            // Добавляем JSON файл с метаданными
            ZipEntry jsonEntry = new ZipEntry("metadata.json");
            zos.putNextEntry(jsonEntry);
            zos.write(objectMapper.writeValueAsBytes(notes));
            zos.closeEntry();
        }
        
        return baos.toByteArray();
    }
} 