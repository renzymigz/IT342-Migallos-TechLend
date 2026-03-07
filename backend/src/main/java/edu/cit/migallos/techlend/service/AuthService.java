package edu.cit.migallos.techlend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.migallos.techlend.dto.AuthResponse;
import edu.cit.migallos.techlend.dto.LoginRequest;
import edu.cit.migallos.techlend.dto.RegisterRequest;
import edu.cit.migallos.techlend.dto.UserProfileResponse;
import edu.cit.migallos.techlend.entity.User;
import edu.cit.migallos.techlend.enums.AuthProvider;
import edu.cit.migallos.techlend.enums.Role;
import edu.cit.migallos.techlend.enums.UserStatus;
import edu.cit.migallos.techlend.repository.UserRepository;
import edu.cit.migallos.techlend.security.JwtUtil;
import edu.cit.migallos.techlend.security.TokenBlacklistService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       TokenBlacklistService tokenBlacklistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if (request.getSchoolId() != null && !request.getSchoolId().isBlank()
                && userRepository.existsBySchoolId(request.getSchoolId())) {
            throw new IllegalArgumentException("School ID already in use");
        }

        User user = new User();
        user.setSchoolId(request.getSchoolId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setContactNumber(request.getContactNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setRole(Role.STUDENT);
        user.setStatus(UserStatus.ACTIVE);

        user = userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findBySchoolId(request.getIdentifier()))
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return null; // Controller will handle 401
        }

        return buildAuthResponse(user);
    }

    public void logout(String token) {
        if (jwtUtil.isTokenValid(token)) {
            tokenBlacklistService.blacklist(token, jwtUtil.extractExpiration(token));
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), user.getEmail());

        UserProfileResponse profile = toProfileResponse(user);
        AuthResponse.TokenPair tokens = new AuthResponse.TokenPair(accessToken, refreshToken);

        return new AuthResponse(profile, tokens);
    }

    public static UserProfileResponse toProfileResponse(User user) {
        UserProfileResponse profile = new UserProfileResponse();
        profile.setUserId(user.getUserId());
        profile.setSchoolId(user.getSchoolId());
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setEmail(user.getEmail());
        profile.setContactNumber(user.getContactNumber());
        profile.setAuthProvider(user.getAuthProvider().name());
        profile.setRole(user.getRole().name());
        profile.setStatus(user.getStatus().name());
        return profile;
    }
}
