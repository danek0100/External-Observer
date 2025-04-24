package com.externalobserver.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "zettels")
public class Zettel {
    @Id
    private String id;
    private String type;
    private String path;
    private LocalDateTime created;
    private LocalDateTime updated;
    private List<String> tags;
    private List<String> links;
    private String content;
    private Map<String, Object> metadata;
    private String status;
    private Integer version;
} 