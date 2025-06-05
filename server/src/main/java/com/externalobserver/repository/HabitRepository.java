package com.externalobserver.repository;

import com.externalobserver.model.Habit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface HabitRepository extends MongoRepository<Habit, String> {
    List<Habit> findByUsernameOrderByOrderAsc(String username);
    
    @Query(value = "{'username': ?0}", sort = "{'order': 1}")
    List<Habit> findAllByUsernameOrderByOrder(String username);
    
    void deleteByUsername(String username);
} 