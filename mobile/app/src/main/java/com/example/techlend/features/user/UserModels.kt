package com.example.techlend.features.user

import com.google.gson.annotations.SerializedName

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
