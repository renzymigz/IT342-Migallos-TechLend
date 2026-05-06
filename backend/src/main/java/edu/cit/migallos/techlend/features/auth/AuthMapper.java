package edu.cit.migallos.techlend.features.auth;

import edu.cit.migallos.techlend.features.user.User;
import edu.cit.migallos.techlend.features.user.dto.UserProfileResponse;

/**
 * Utility class for mapping User entities to profile response DTOs.
 * Shared between the auth and user feature slices.
 */
public class AuthMapper {

    private AuthMapper() {
        // utility class
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
