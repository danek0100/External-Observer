package com.externalobserver.repository;

import com.externalobserver.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends MongoRepository<Note, String> {
    List<Note> findByTagsIn(List<String> tags);
    List<Note> findByTagsInAndStatus(List<String> tags, String status);
    List<Note> findByTitleContainingIgnoreCase(String title);
    List<Note> findByType(String type);
    List<Note> findByStatus(String status);
    Optional<Note> findByPath(String path);
    List<Note> findByLinksContaining(String link);
    
    @Query("{ 'content': { $regex: ?0, $options: 'i' }}")
    List<Note> findByContentContainingIgnoreCase(String keyword);
    
    @Query("{ $or: [ { 'tags': { $in: ?0 } }, { 'content': { $regex: ?1, $options: 'i' } } ] }")
    List<Note> findByTagsInOrContentContainingIgnoreCase(List<String> tags, String keyword);
} 