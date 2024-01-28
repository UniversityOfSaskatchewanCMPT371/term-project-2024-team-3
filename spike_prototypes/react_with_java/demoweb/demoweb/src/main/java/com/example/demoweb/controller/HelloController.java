
package com.example.demoweb.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {
    // ...

    @GetMapping("/hello")
    public Message hello() {
        //simple message object
        Message message = new Message();
        message.setMessage("Hello from Spring Boot!");

        return message;
    }
}



    // Define a simple message object
    class Message {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
