package edu.cit.migallos.techlend.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.migallos.techlend.dto.ApiResponse;
import edu.cit.migallos.techlend.dto.UserProfileResponse;
import edu.cit.migallos.techlend.entity.User;
import edu.cit.migallos.techlend.repository.UserRepository;
import edu.cit.migallos.techlend.service.AuthService;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        UserProfileResponse profile = AuthService.toProfileResponse(user);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
