package com.externalobserver.controller;

import com.externalobserver.model.Habit;
import com.externalobserver.model.HabitCheck;
import com.externalobserver.service.HabitService;
import com.externalobserver.service.ExcelExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {
    private final HabitService habitService;
    private final ExcelExportService excelExportService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping
    public ResponseEntity<List<Habit>> getHabits(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.getHabits(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(
        @RequestBody Habit habit,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.createHabit(habit, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(
        @PathVariable String id,
        @RequestBody Habit habit,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.updateHabit(id, habit, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
        @PathVariable String id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        habitService.deleteHabit(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order")
    public ResponseEntity<Void> updateHabitsOrder(
        @RequestBody List<Map<String, Object>> habits,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        habitService.updateHabitsOrder(habits, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/checks")
    public ResponseEntity<List<HabitCheck>> getHabitChecks(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.getHabitChecks(userDetails.getUsername(), date));
    }

    @GetMapping("/checks/period")
    public ResponseEntity<List<HabitCheck>> getHabitChecksForPeriod(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.getHabitChecksForPeriod(
            userDetails.getUsername(), startDate, endDate));
    }

    @PostMapping("/{habitId}/checks")
    public ResponseEntity<HabitCheck> createOrUpdateHabitCheck(
        @PathVariable String habitId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam boolean completed,
        @RequestParam(required = false) String comment,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(habitService.createOrUpdateHabitCheck(
            habitId, date, completed, comment, userDetails.getUsername()));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            byte[] excelFile = excelExportService.exportHabitChecksToExcel(
                userDetails.getUsername(), startDate, endDate);

            String filename = String.format("habits_%s_%s.xlsx",
                startDate.format(DATE_FORMATTER),
                endDate.format(DATE_FORMATTER));

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelFile);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 