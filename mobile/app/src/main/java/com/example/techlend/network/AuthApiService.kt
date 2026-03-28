package com.example.techlend.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface AuthApiService {
    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<ApiResponse<AuthResponse>>

    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<ApiResponse<AuthResponse>>

    @POST("auth/logout")
    suspend fun logout(
        @Header("Authorization") bearerToken: String
    ): Response<ApiResponse<Unit>>

    @GET("users/me")
    suspend fun getMe(
        @Header("Authorization") bearerToken: String
    ): Response<ApiResponse<UserProfileResponse>>
}