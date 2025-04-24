package com.externalobserver.repository;

import com.externalobserver.model.Zettel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ZettelRepository extends MongoRepository<Zettel, String> {
    List<Zettel> findByType(String type);
    List<Zettel> findByTagsContaining(String tag);
    List<Zettel> findByPathStartingWith(String path);
    Optional<Zettel> findByIdAndVersion(String id, Integer version);
    List<Zettel> findByLinksContaining(String linkId);
    List<Zettel> findByTagsIn(List<String> tags);
    
    @Query("{ 'content': { $regex: ?0, $options: 'i' }}")
    List<Zettel> findByContentContainingIgnoreCase(String keyword);
    
    @Query("{ $or: [ { 'tags': { $in: ?0 } }, { 'content': { $regex: ?1, $options: 'i' } } ] }")
    List<Zettel> findByTagsInOrContentContainingIgnoreCase(List<String> tags, String keyword);
} 