package com.ssafy.iscream;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@EnableCaching
@EnableJpaAuditing
@EnableScheduling
@SpringBootApplication
public class IsCreamApplication {
    public static void main(String[] args) {
        SpringApplication.run(IsCreamApplication.class, args);
    }

    @PostConstruct
    public static void init(){
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

}
