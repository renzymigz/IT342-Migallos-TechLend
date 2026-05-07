package edu.cit.migallos.techlend.features.user;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.features.auth.AuthMapper;
import edu.cit.migallos.techlend.shared.response.ApiResponse;
import edu.cit.migallos.techlend.features.user.dto.SuspendUserRequest;
import edu.cit.migallos.techlend.features.user.dto.UpdateUserRoleRequest;
import edu.cit.migallos.techlend.features.user.dto.UserProfileResponse;
import edu.cit.migallos.techlend.features.user.dto.UserResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("USER-001", "User not found", null));
        }

        UserProfileResponse profile = AuthMapper.toProfileResponse(user);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    // Admin endpoints
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID userId) {
        UserResponse user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("USER-001", "User not found", null));
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        UserResponse user = userService.updateUserRole(userId, request);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("USER-001", "User not found", null));
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/{userId}/suspend")
    public ResponseEntity<ApiResponse<UserResponse>> suspendUser(
            @PathVariable UUID userId,
            @Valid @RequestBody SuspendUserRequest request) {
        UserResponse user = userService.suspendUser(userId, request);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("USER-001", "User not found", null));
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/{userId}/unsuspend")
    public ResponseEntity<ApiResponse<UserResponse>> unsuspendUser(@PathVariable UUID userId) {
        UserResponse user = userService.unsuspendUser(userId);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("USER-001", "User not found", null));
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
