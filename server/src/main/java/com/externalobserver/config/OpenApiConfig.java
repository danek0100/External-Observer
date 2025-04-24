package com.externalobserver.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("External Observer API")
                        .description("API для персональной системы управления жизнью")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Danil Sobolev")
                                .email("danil@example.com"))
                        .license(new License()
                                .name("Personal/Non-commercial")
                                .url("https://github.com/yourusername/external-observer")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Локальный сервер разработки")
                ));
    }
} 