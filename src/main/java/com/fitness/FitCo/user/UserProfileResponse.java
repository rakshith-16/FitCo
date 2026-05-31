package com.fitness.FitCo.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String gender;
    private LocalDate dateOfBirth;
    private Double heightCm;
    private Double weightKg;
    private String fitnessGoal;
    private LocalDateTime createdAt;

    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getHeightCm(),
                user.getWeightKg(),
                user.getFitnessGoal(),
                user.getCreatedAt()
        );
    }
}
