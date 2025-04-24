package com.externalobserver.service;

import com.externalobserver.model.Zettel;
import com.externalobserver.repository.ZettelRepository;
import com.externalobserver.dto.ZettelRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ZettelService {
    private final ZettelRepository zettelRepository;

    public List<Zettel> getAllZettels() {
        return zettelRepository.findAll();
    }

    @Transactional
    public Zettel createZettel(ZettelRequest request) {
        Zettel zettel = new Zettel();
        zettel.setType(request.getType());
        zettel.setPath(request.getPath());
        zettel.setContent(request.getContent());
        zettel.setTags(request.getTags());
        zettel.setLinks(request.getLinks());
        zettel.setMetadata(request.getMetadata());
        zettel.setStatus(request.getStatus());
        zettel.setCreated(LocalDateTime.now());
        zettel.setUpdated(LocalDateTime.now());
        zettel.setVersion(1);
        return zettelRepository.save(zettel);
    }

    @Transactional
    public Optional<Zettel> updateZettel(String id, ZettelRequest request) {
        return zettelRepository.findById(id).map(zettel -> {
            zettel.setType(request.getType());
            zettel.setPath(request.getPath());
            zettel.setContent(request.getContent());
            zettel.setTags(request.getTags());
            zettel.setLinks(request.getLinks());
            zettel.setMetadata(request.getMetadata());
            zettel.setStatus(request.getStatus());
            zettel.setUpdated(LocalDateTime.now());
            zettel.setVersion(zettel.getVersion() + 1);
            return zettelRepository.save(zettel);
        });
    }

    @Transactional
    public void deleteZettel(String id) {
        zettelRepository.deleteById(id);
    }

    public Optional<Zettel> getZettelById(String id) {
        return zettelRepository.findById(id);
    }
} 