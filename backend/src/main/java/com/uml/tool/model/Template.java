package com.uml.tool.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "templates")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // "customized" or "design pattern"
    private String type;

    @Column(columnDefinition = "TEXT")
    private String diagramJson;
} 