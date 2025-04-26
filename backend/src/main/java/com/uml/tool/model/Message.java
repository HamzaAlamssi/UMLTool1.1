package com.uml.tool.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserLoginDetails sender;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;
}
