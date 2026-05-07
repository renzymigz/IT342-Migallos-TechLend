package com.example.techlend.features.auth

import com.example.techlend.features.user.UserProfileResponse
import com.google.gson.annotations.SerializedName

// Wrapper for all API responses
data class AuthApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T?,
    @SerializedName("error") val error: AuthApiError?,
    @SerializedName("timestamp") val timestamp: String?
)

data class AuthApiError(
    @SerializedName("code") val code: String?,
    @SerializedName("message") val message: String?,
    @SerializedName("details") val details: Any?
)

data class LoginRequest(
    @SerializedName("identifier") val identifier: String,
    @SerializedName("password") val password: String
)

data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("schoolId") val schoolId: String?,
    @SerializedName("contactNumber") val contactNumber: String?
)

data class AuthResponse(
    @SerializedName("user") val user: UserProfileResponse?,
    @SerializedName("tokens") val tokens: TokenPair?
)

data class TokenPair(
    @SerializedName("accessToken") val accessToken: String?,
    @SerializedName("refreshToken") val refreshToken: String?
)
