package com.cookingskills.usermanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "workplans")
public class WorkPlan {
    @Id
    private String id;
    private String userId; 
    private String title; 
    private String description;
    private List<String> topics; 
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; 
    private LocalDate createdAt;
    private LocalDate updatedAt;
}