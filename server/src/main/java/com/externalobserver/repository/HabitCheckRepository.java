package com.externalobserver.repository;

import com.externalobserver.model.HabitCheck;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface HabitCheckRepository extends MongoRepository<HabitCheck, String> {
    List<HabitCheck> findByUsernameAndDateBetweenOrderByDateAsc(
        String username, 
        LocalDate startDate, 
        LocalDate endDate
    );
    
    List<HabitCheck> findByUsernameAndHabitIdAndDateBetweenOrderByDateAsc(
        String username,
        String habitId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    HabitCheck findByUsernameAndHabitIdAndDate(
        String username,
        String habitId,
        LocalDate date
    );
    
    void deleteByUsername(String username);
    
    @Query(value = "{'username': ?0, 'date': {$gte: ?1, $lte: ?2}}", 
           fields = "{'habitId': 1, 'date': 1, 'completed': 1, 'comment': 1}")
    List<HabitCheck> findChecksForPeriod(
        String username,
        LocalDate startDate,
        LocalDate endDate
    );
} 