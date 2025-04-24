package com.externalobserver.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Data
public class ZettelRequest {
    @NotBlank
    private String type;
    
    private String path;
    
    @NotBlank
    private String content;
    
    private List<String> tags;
    private List<String> links;
    private Map<String, Object> metadata;
    private String status;
} 