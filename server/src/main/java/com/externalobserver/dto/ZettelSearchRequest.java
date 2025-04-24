package com.externalobserver.dto;

import lombok.Data;
import java.util.List;

@Data
public class ZettelSearchRequest {
    private List<String> tags;
    private String keyword;
    private Boolean matchAll = false; // если true, должны совпадать все теги
} 