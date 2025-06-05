package com.externalobserver.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "habit_checks")
public class HabitCheck {
    @Id
    private String id;
    private String habitId;
    private String username;
    private LocalDate date;
    private boolean completed;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 