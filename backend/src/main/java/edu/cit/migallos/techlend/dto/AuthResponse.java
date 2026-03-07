package edu.cit.migallos.techlend.dto;

public class AuthResponse {

    private UserProfileResponse user;
    private TokenPair tokens;

    public AuthResponse(UserProfileResponse user, TokenPair tokens) {
        this.user = user;
        this.tokens = tokens;
    }

    public UserProfileResponse getUser() {
        return user;
    }

    public TokenPair getTokens() {
        return tokens;
    }

    public static class TokenPair {
        private String accessToken;
        private String refreshToken;

        public TokenPair(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }
    }
}
