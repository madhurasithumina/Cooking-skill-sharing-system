package com.cookingskills.usermanagement.repository;

import com.cookingskills.usermanagement.model.WorkPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkPlanRepository extends MongoRepository<WorkPlan, String> {
    List<WorkPlan> findByUserId(String userId);
}