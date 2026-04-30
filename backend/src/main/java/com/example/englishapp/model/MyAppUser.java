package com.example.englishapp.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class MyAppUser {



    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq",
            sequenceName = "my_app_user_seq",
            allocationSize = 1) // <--- allocationSize=1 to klucz
    private Long id;
    private String username;
    private String password;
    private String email;



}
