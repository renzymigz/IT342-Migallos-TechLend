package com.example.techlend.network

import com.google.gson.annotations.SerializedName

data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T?,
    @SerializedName("error") val error: ApiError?,
    @SerializedName("timestamp") val timestamp: String?
)

data class ApiError(
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

data class UserProfileResponse(
    @SerializedName("userId") val userId: String?,
    @SerializedName("schoolId") val schoolId: String?,
    @SerializedName("firstName") val firstName: String?,
    @SerializedName("lastName") val lastName: String?,
    @SerializedName("email") val email: String?,
    @SerializedName("contactNumber") val contactNumber: String?,
    @SerializedName("authProvider") val authProvider: String?,
    @SerializedName("role") val role: String?,
    @SerializedName("status") val status: String?
)