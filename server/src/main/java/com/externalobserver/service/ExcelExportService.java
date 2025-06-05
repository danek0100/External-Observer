package com.externalobserver.service;

import com.externalobserver.model.Habit;
import com.externalobserver.model.HabitCheck;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExcelExportService {
    private final HabitService habitService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    public byte[] exportHabitChecksToExcel(
        String username,
        LocalDate startDate,
        LocalDate endDate
    ) throws Exception {
        List<Habit> habits = habitService.getHabits(username);
        List<HabitCheck> checks = habitService.getHabitChecksForPeriod(username, startDate, endDate);

        // Группируем отметки по датам
        Map<LocalDate, Map<String, HabitCheck>> checksByDate = checks.stream()
            .collect(Collectors.groupingBy(
                HabitCheck::getDate,
                Collectors.toMap(HabitCheck::getHabitId, check -> check)
            ));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Привычки");

            // Создаем стили
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle checkStyle = createCheckStyle(workbook);
            CellStyle commentStyle = createCommentStyle(workbook);

            // Создаем заголовок
            Row headerRow = sheet.createRow(0);
            Cell headerCell = headerRow.createCell(0);
            headerCell.setCellValue("Привычка");
            headerCell.setCellStyle(headerStyle);

            // Добавляем даты в заголовок
            int colNum = 1;
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                Cell dateCell = headerRow.createCell(colNum++);
                dateCell.setCellValue(currentDate.format(DATE_FORMATTER));
                dateCell.setCellStyle(headerStyle);
                currentDate = currentDate.plusDays(1);
            }

            // Добавляем привычки и их отметки
            int rowNum = 1;
            for (Habit habit : habits) {
                Row row = sheet.createRow(rowNum++);
                
                // Название привычки
                Cell nameCell = row.createCell(0);
                nameCell.setCellValue(habit.getName());
                nameCell.setCellStyle(headerStyle);

                // Отметки по дням
                colNum = 1;
                currentDate = startDate;
                while (!currentDate.isAfter(endDate)) {
                    Map<String, HabitCheck> dateChecks = checksByDate.get(currentDate);
                    HabitCheck check = dateChecks != null ? dateChecks.get(habit.getId()) : null;

                    Cell checkCell = row.createCell(colNum++);
                    if (check != null) {
                        checkCell.setCellValue(check.isCompleted() ? "✓" : "✗");
                        checkCell.setCellStyle(checkStyle);

                        // Добавляем комментарий в следующую строку, если он есть
                        if (check.getComment() != null && !check.getComment().isEmpty()) {
                            Row commentRow = sheet.createRow(rowNum++);
                            Cell commentCell = commentRow.createCell(0);
                            commentCell.setCellValue("Комментарий: " + check.getComment());
                            commentCell.setCellStyle(commentStyle);
                        }
                    }
                    currentDate = currentDate.plusDays(1);
                }
            }

            // Автоматически подгоняем ширину столбцов
            for (int i = 0; i < colNum; i++) {
                sheet.autoSizeColumn(i);
            }

            // Записываем в байтовый массив
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createCheckStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createCommentStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setWrapText(true);
        return style;
    }
} 