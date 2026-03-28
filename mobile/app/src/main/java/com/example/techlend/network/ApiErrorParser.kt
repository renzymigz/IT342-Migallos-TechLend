package com.example.techlend.network

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.LinkedHashMap
import retrofit2.Response

object ApiErrorParser {
    private val gson = Gson()

    fun <T> getMessage(response: Response<ApiResponse<T>>, fallback: String): String {
        val bodyMessage = response.body()?.error?.message
        if (!bodyMessage.isNullOrBlank()) {
            return bodyMessage
        }

        val errorBody = response.errorBody()?.string()
        if (!errorBody.isNullOrBlank()) {
            return runCatching {
                val type = object : TypeToken<ApiResponse<Any>>() {}.type
                val parsed: ApiResponse<Any> = gson.fromJson(errorBody, type)
                val detailsMessage = formatDetails(parsed.error?.details)
                if (!detailsMessage.isNullOrBlank()) detailsMessage else parsed.error?.message
            }.getOrNull().orEmpty().ifBlank { fallback }
        }

        return fallback
    }

    private fun formatDetails(details: Any?): String? {
        val detailsMap = details as? LinkedHashMap<*, *> ?: return null
        val firstError = detailsMap.entries.firstOrNull() ?: return null
        val key = firstError.key?.toString().orEmpty()
        val value = firstError.value?.toString().orEmpty()
        if (key.isBlank() || value.isBlank()) {
            return null
        }
        return "$key: $value"
    }
}
