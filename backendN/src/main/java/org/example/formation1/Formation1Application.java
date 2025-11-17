package org.example.formation1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Formation1Application {

    public static void main(String[] args) {
        SpringApplication.run(Formation1Application.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.example.formation1.Services.TicketPdfService ticketPdfService() {
        return new org.example.formation1.Services.TicketPdfService();
    }

}
