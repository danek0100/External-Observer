package com.externalobserver.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "habits")
public class Habit {
    @Id
    private String id;
    private String name;
    private String description;
    private String purpose;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer order;
} 