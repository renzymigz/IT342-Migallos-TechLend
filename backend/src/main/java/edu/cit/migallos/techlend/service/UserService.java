package edu.cit.migallos.techlend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.migallos.techlend.dto.SuspendUserRequest;
import edu.cit.migallos.techlend.dto.UpdateUserRoleRequest;
import edu.cit.migallos.techlend.dto.UserResponse;
import edu.cit.migallos.techlend.entity.User;
import edu.cit.migallos.techlend.enums.Role;
import edu.cit.migallos.techlend.enums.UserStatus;
import edu.cit.migallos.techlend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return null;
        }
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserRole(UUID userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return null;
        }
        user.setRole(request.getRole());
        userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse suspendUser(UUID userId, SuspendUserRequest request) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return null;
        }
        user.setStatus(UserStatus.SUSPENDED);
        user.setSuspensionReason(request.getSuspensionReason());
        userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse unsuspendUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return null;
        }
        user.setStatus(UserStatus.ACTIVE);
        user.setSuspensionReason(null);
        userRepository.save(user);
        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getSchoolId(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getSuspensionReason());
    }
}
