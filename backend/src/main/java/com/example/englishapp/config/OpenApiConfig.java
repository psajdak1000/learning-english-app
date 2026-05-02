package com.example.englishapp.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "English App API",
                description = "Backend API for web and mobile clients",
                version = "1.0.0"
        )
)
public class OpenApiConfig {
}
