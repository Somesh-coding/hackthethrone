package com.govscheme.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class GovSchemePortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(GovSchemePortalApplication.class, args);
    }
}
