package edu.cit.migallos.techlend.dto;

import edu.cit.migallos.techlend.enums.Role;
import jakarta.validation.constraints.NotNull;

public class UpdateUserRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;

    public UpdateUserRoleRequest() {
    }

    public UpdateUserRoleRequest(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
