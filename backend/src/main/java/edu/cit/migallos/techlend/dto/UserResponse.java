package edu.cit.migallos.techlend.dto;

import java.util.UUID;

import edu.cit.migallos.techlend.enums.Role;
import edu.cit.migallos.techlend.enums.UserStatus;

public class UserResponse {

    private UUID userId;
    private String name;
    private String schoolId;
    private String email;
    private Role role;
    private UserStatus status;
    private String suspensionReason;

    public UserResponse() {
    }

    public UserResponse(UUID userId, String name, String schoolId, String email, Role role, UserStatus status,
            String suspensionReason) {
        this.userId = userId;
        this.name = name;
        this.schoolId = schoolId;
        this.email = email;
        this.role = role;
        this.status = status;
        this.suspensionReason = suspensionReason;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public String getSuspensionReason() {
        return suspensionReason;
    }

    public void setSuspensionReason(String suspensionReason) {
        this.suspensionReason = suspensionReason;
    }
}
