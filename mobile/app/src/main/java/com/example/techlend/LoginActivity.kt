package com.example.techlend

import android.content.Intent
import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.view.MotionEvent
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import androidx.lifecycle.lifecycleScope
import com.example.techlend.auth.SessionManager
import com.example.techlend.network.ApiClient
import com.example.techlend.network.ApiErrorParser
import com.example.techlend.network.LoginRequest
import java.io.IOException
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager

    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnSignIn: AppCompatButton
    private lateinit var btnGoogleSignIn: AppCompatButton
    private lateinit var tvToggleRegister: TextView
    private lateinit var tvForgotPassword: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)
        bindViews()
        setupListeners()

        if (sessionManager.isLoggedIn()) {
            validateExistingSession()
        }
    }

    private fun bindViews() {
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnSignIn = findViewById(R.id.btnSignIn)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvToggleRegister = findViewById(R.id.tvToggleRegister)
        tvForgotPassword = findViewById(R.id.tvForgotPassword)
    }

    private fun setupListeners() {
        findViewById<TextView>(R.id.tvToggleSignIn).setOnClickListener {
            // Already on login screen.
        }

        setupPasswordToggle(etPassword)

        tvToggleRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            finish()
        }

        btnGoogleSignIn.setOnClickListener {
            Toast.makeText(this, "Google sign-in will be added soon.", Toast.LENGTH_SHORT).show()
        }

        tvForgotPassword.setOnClickListener {
            Toast.makeText(this, "Forgot password flow is not yet available.", Toast.LENGTH_SHORT).show()
        }

        btnSignIn.setOnClickListener {
            loginUser()
        }
    }

    private fun setupPasswordToggle(passwordField: EditText) {
        var isPasswordVisible = false
        passwordField.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, R.drawable.ic_eye_off, 0)

        passwordField.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_UP) {
                val endDrawable = passwordField.compoundDrawablesRelative[2] ?: return@setOnTouchListener false
                val isTouchOnEndDrawable = event.rawX >=
                    (passwordField.right - endDrawable.bounds.width() - passwordField.paddingEnd)

                if (isTouchOnEndDrawable) {
                    isPasswordVisible = !isPasswordVisible
                    passwordField.transformationMethod = if (isPasswordVisible) {
                        HideReturnsTransformationMethod.getInstance()
                    } else {
                        PasswordTransformationMethod.getInstance()
                    }

                    val iconRes = if (isPasswordVisible) R.drawable.ic_eye else R.drawable.ic_eye_off
                    passwordField.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0, iconRes, 0)
                    passwordField.setSelection(passwordField.text?.length ?: 0)
                    passwordField.performClick()
                    return@setOnTouchListener true
                }
            }

            false
        }
    }

    private fun validateExistingSession() {
        val token = sessionManager.getAccessToken() ?: return
        lifecycleScope.launch {
            setLoading(true)
            try {
                val response = ApiClient.authApi.getMe("Bearer $token")
                if (response.isSuccessful && response.body()?.success == true) {
                    openDashboard()
                } else {
                    sessionManager.clearSession()
                }
            } catch (_: Exception) {
                // Keep user on login screen if server is unavailable during app start.
            } finally {
                setLoading(false)
            }
        }
    }

    private fun loginUser() {
        val identifier = etEmail.text.toString().trim()
        val password = etPassword.text.toString()

        if (identifier.isBlank()) {
            etEmail.error = "Email or School ID is required"
            etEmail.requestFocus()
            return
        }

        if (password.isBlank()) {
            etPassword.error = "Password is required"
            etPassword.requestFocus()
            return
        }

        lifecycleScope.launch {
            setLoading(true)
            try {
                val response = ApiClient.authApi.login(LoginRequest(identifier, password))
                val responseBody = response.body()

                if (response.isSuccessful && responseBody?.success == true) {
                    val authData = responseBody.data
                    val tokens = authData?.tokens
                    if (tokens?.accessToken.isNullOrBlank() || tokens?.refreshToken.isNullOrBlank()) {
                        showToast("Login succeeded but tokens were not returned")
                        return@launch
                    }

                    val fullName = listOfNotNull(authData?.user?.firstName, authData?.user?.lastName)
                        .joinToString(" ")
                        .ifBlank { null }

                    sessionManager.saveAuth(
                        accessToken = tokens?.accessToken.orEmpty(),
                        refreshToken = tokens?.refreshToken.orEmpty(),
                        email = authData?.user?.email,
                        fullName = fullName
                    )
                    showToast("Login successful!")
                    openDashboard()
                } else {
                    val message = ApiErrorParser.getMessage(response, "Unable to sign in")
                    showToast(message)
                }
            } catch (e: IOException) {
                showToast(getNetworkHint(e))
            } catch (_: Exception) {
                showToast("Something went wrong while signing in")
            } finally {
                setLoading(false)
            }
        }
    }

    private fun openDashboard() {
        startActivity(
            Intent(this, DashboardActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
        )
        finish()
    }

    private fun setLoading(isLoading: Boolean) {
        btnSignIn.isEnabled = !isLoading
        tvToggleRegister.isEnabled = !isLoading
        btnSignIn.text = if (isLoading) "Signing In..." else "Sign In"
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun getNetworkHint(error: IOException): String {
        val msg = error.message.orEmpty()
        return when {
            msg.contains("CLEARTEXT", ignoreCase = true) -> {
                "HTTP blocked by Android cleartext policy."
            }
            msg.contains("10.0.2.2") -> {
                "Cannot reach 10.0.2.2:8080. Start backend; on physical device, use your PC LAN IP instead."
            }
            else -> {
                "Cannot reach server. Ensure backend is running on port 8080."
            }
        }
    }
}