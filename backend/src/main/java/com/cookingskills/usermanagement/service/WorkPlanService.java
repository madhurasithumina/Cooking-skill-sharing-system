package com.cookingskills.usermanagement.service;

import com.cookingskills.usermanagement.model.WorkPlan;
import com.cookingskills.usermanagement.repository.WorkPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkPlanService {

    @Autowired
    private WorkPlanRepository workPlanRepository;

    // Create a new work plan
    public WorkPlan createWorkPlan(WorkPlan workPlan) {
        workPlan.setCreatedAt(LocalDate.now());
        workPlan.setUpdatedAt(LocalDate.now());
        return workPlanRepository.save(workPlan);
    }

    // Get all work plans for a user
    public List<WorkPlan> getWorkPlansByUser(String userId) {
        return workPlanRepository.findByUserId(userId);
    }

    // Get a specific work plan
    public WorkPlan getWorkPlan(String id) {
        return workPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work plan not found"));
    }

    // Update a work plan
    public WorkPlan updateWorkPlan(String id, WorkPlan updatedWorkPlan) {
        WorkPlan existingWorkPlan = getWorkPlan(id);
        existingWorkPlan.setTitle(updatedWorkPlan.getTitle());
        existingWorkPlan.setDescription(updatedWorkPlan.getDescription());
        existingWorkPlan.setTopics(updatedWorkPlan.getTopics());
        existingWorkPlan.setStartDate(updatedWorkPlan.getStartDate());
        existingWorkPlan.setEndDate(updatedWorkPlan.getEndDate());
        existingWorkPlan.setStatus(updatedWorkPlan.getStatus());
        existingWorkPlan.setUpdatedAt(LocalDate.now());
        return workPlanRepository.save(existingWorkPlan);
    }

    // Delete a work plan
    public void deleteWorkPlan(String id) {
        WorkPlan workPlan = getWorkPlan(id);
        workPlanRepository.delete(workPlan);
    }
}