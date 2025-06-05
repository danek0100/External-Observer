package com.externalobserver.service;

import com.externalobserver.model.Habit;
import com.externalobserver.model.HabitCheck;
import com.externalobserver.repository.HabitRepository;
import com.externalobserver.repository.HabitCheckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitCheckRepository habitCheckRepository;

    public List<Habit> getHabits(String username) {
        return habitRepository.findByUsernameOrderByOrderAsc(username);
    }

    public Habit createHabit(Habit habit, String username) {
        habit.setUsername(username);
        habit.setCreatedAt(LocalDateTime.now());
        habit.setUpdatedAt(LocalDateTime.now());
        
        // Устанавливаем порядок как последний
        List<Habit> habits = habitRepository.findByUsernameOrderByOrderAsc(username);
        int maxOrder = habits.stream()
            .mapToInt(Habit::getOrder)
            .max()
            .orElse(0);
        habit.setOrder(maxOrder + 1);
        
        return habitRepository.save(habit);
    }

    public Habit updateHabit(String id, Habit habit, String username) {
        Habit existingHabit = habitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Привычка не найдена"));
            
        if (!existingHabit.getUsername().equals(username)) {
            throw new RuntimeException("Нет доступа к привычке");
        }

        existingHabit.setName(habit.getName());
        existingHabit.setDescription(habit.getDescription());
        existingHabit.setPurpose(habit.getPurpose());
        existingHabit.setUpdatedAt(LocalDateTime.now());

        return habitRepository.save(existingHabit);
    }

    public void deleteHabit(String id, String username) {
        Habit habit = habitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Привычка не найдена"));
            
        if (!habit.getUsername().equals(username)) {
            throw new RuntimeException("Нет доступа к привычке");
        }

        // Удаляем все отметки о выполнении
        List<HabitCheck> checks = habitCheckRepository.findByUsernameAndHabitIdAndDateBetweenOrderByDateAsc(
            username, id, LocalDate.MIN, LocalDate.MAX);
        habitCheckRepository.deleteAll(checks);

        habitRepository.delete(habit);
    }

    @Transactional
    public void updateHabitsOrder(List<Map<String, Object>> habits, String username) {
        for (int i = 0; i < habits.size(); i++) {
            String id = (String) habits.get(i).get("id");
            Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Привычка не найдена"));
                
            if (!habit.getUsername().equals(username)) {
                throw new RuntimeException("Нет доступа к привычке");
            }

            habit.setOrder(i + 1);
            habit.setUpdatedAt(LocalDateTime.now());
            habitRepository.save(habit);
        }
    }

    public List<HabitCheck> getHabitChecks(String username, LocalDate date) {
        return habitCheckRepository.findByUsernameAndDateBetweenOrderByDateAsc(
            username, date, date);
    }

    public List<HabitCheck> getHabitChecksForPeriod(
        String username, 
        LocalDate startDate, 
        LocalDate endDate
    ) {
        return habitCheckRepository.findChecksForPeriod(username, startDate, endDate);
    }

    public HabitCheck createOrUpdateHabitCheck(
        String habitId, 
        LocalDate date, 
        boolean completed, 
        String comment, 
        String username
    ) {
        Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new RuntimeException("Привычка не найдена"));
            
        if (!habit.getUsername().equals(username)) {
            throw new RuntimeException("Нет доступа к привычке");
        }

        HabitCheck check = habitCheckRepository.findByUsernameAndHabitIdAndDate(
            username, habitId, date);

        if (check == null) {
            check = new HabitCheck();
            check.setHabitId(habitId);
            check.setUsername(username);
            check.setDate(date);
            check.setCreatedAt(LocalDateTime.now());
        }

        check.setCompleted(completed);
        check.setComment(comment);
        check.setUpdatedAt(LocalDateTime.now());

        return habitCheckRepository.save(check);
    }
} 