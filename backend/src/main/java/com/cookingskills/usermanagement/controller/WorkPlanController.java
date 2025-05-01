package com.cookingskills.usermanagement.controller;

import com.cookingskills.usermanagement.model.WorkPlan;
import com.cookingskills.usermanagement.service.WorkPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workplans")
public class WorkPlanController {

    @Autowired
    private WorkPlanService workPlanService;

    // Create a work plan
    @PostMapping
    public ResponseEntity<WorkPlan> createWorkPlan(@RequestBody WorkPlan workPlan) {
        WorkPlan createdWorkPlan = workPlanService.createWorkPlan(workPlan);
        return ResponseEntity.ok(createdWorkPlan);
    }

    // Get all work plans for a user
    @GetMapping
    public ResponseEntity<List<WorkPlan>> getWorkPlansByUser(@RequestParam String userId) {
        List<WorkPlan> workPlans = workPlanService.getWorkPlansByUser(userId);
        return ResponseEntity.ok(workPlans);
    }

    // Get a specific work plan
    @GetMapping("/{id}")
    public ResponseEntity<WorkPlan> getWorkPlan(@PathVariable String id) {
        WorkPlan workPlan = workPlanService.getWorkPlan(id);
        return ResponseEntity.ok(workPlan);
    }

    // Update a work plan
    @PutMapping("/{id}")
    public ResponseEntity<WorkPlan> updateWorkPlan(@PathVariable String id, @RequestBody WorkPlan workPlan) {
        WorkPlan updatedWorkPlan = workPlanService.updateWorkPlan(id, workPlan);
        return ResponseEntity.ok(updatedWorkPlan);
    }

    // Delete a work plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkPlan(@PathVariable String id) {
        workPlanService.deleteWorkPlan(id);
        return ResponseEntity.noContent().build();
    }
}