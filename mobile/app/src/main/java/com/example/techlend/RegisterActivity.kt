package com.example.techlend

import android.content.Intent
import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Patterns
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
import com.example.techlend.network.RegisterRequest
import java.io.IOException
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager

    private lateinit var etFirstName: EditText
    private lateinit var etLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var etSchoolId: EditText
    private lateinit var etContactNo: EditText
    private lateinit var btnCreateAccount: AppCompatButton
    private lateinit var btnGoogleSignIn: AppCompatButton
    private lateinit var tvToggleSignIn: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        sessionManager = SessionManager(this)
        bindViews()
        setupListeners()
    }

    private fun bindViews() {
        etFirstName = findViewById(R.id.etFirstName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        etSchoolId = findViewById(R.id.etSchoolId)
        etContactNo = findViewById(R.id.etContactNo)
        btnCreateAccount = findViewById(R.id.btnCreateAccount)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvToggleSignIn = findViewById(R.id.tvToggleSignIn)
    }

    private fun setupListeners() {
        findViewById<TextView>(R.id.tvToggleRegister).setOnClickListener {
            // Already on register screen.
        }

        setupPasswordToggle(etPassword)

        tvToggleSignIn.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        btnGoogleSignIn.setOnClickListener {
            Toast.makeText(this, "Google sign-in will be added soon.", Toast.LENGTH_SHORT).show()
        }

        btnCreateAccount.setOnClickListener {
            registerUser()
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

    private fun registerUser() {
        val firstName = etFirstName.text.toString().trim()
        val lastName = etLastName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString()
        val schoolId = etSchoolId.text.toString().trim()
        val contactNo = etContactNo.text.toString().trim().ifBlank { null }

        if (firstName.isBlank()) {
            etFirstName.error = "First name is required"
            etFirstName.requestFocus()
            return
        }
        if (lastName.isBlank()) {
            etLastName.error = "Last name is required"
            etLastName.requestFocus()
            return
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.error = "Enter a valid email"
            etEmail.requestFocus()
            return
        }
        if (password.length < 8) {
            etPassword.error = "Password must be at least 8 characters"
            etPassword.requestFocus()
            return
        }
        if (schoolId.isBlank()) {
            etSchoolId.error = "School ID is required"
            etSchoolId.requestFocus()
            return
        }

        lifecycleScope.launch {
            setLoading(true)
            try {
                val request = RegisterRequest(
                    email = email,
                    password = password,
                    firstName = firstName,
                    lastName = lastName,
                    schoolId = schoolId,
                    contactNumber = contactNo
                )
                val response = ApiClient.authApi.register(request)
                val responseBody = response.body()

                if (response.isSuccessful && responseBody?.success == true) {
                    val authData = responseBody.data
                    val tokens = authData?.tokens
                    if (tokens?.accessToken.isNullOrBlank() || tokens?.refreshToken.isNullOrBlank()) {
                        showToast("Registration succeeded but tokens were not returned")
                        return@launch
                    }

                    sessionManager.saveAuth(
                        accessToken = tokens?.accessToken.orEmpty(),
                        refreshToken = tokens?.refreshToken.orEmpty(),
                        email = authData?.user?.email,
                        fullName = "$firstName $lastName"
                    )
                    showToast("Registration successful!")
                    openDashboard()
                } else {
                    val message = ApiErrorParser.getMessage(response, "Unable to create account")
                    showToast(message)
                }
            } catch (e: IOException) {
                showToast(getNetworkHint(e))
            } catch (_: Exception) {
                showToast("Something went wrong while creating account")
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
        btnCreateAccount.isEnabled = !isLoading
        tvToggleSignIn.isEnabled = !isLoading
        btnCreateAccount.text = if (isLoading) "Creating Account..." else "Create Account"
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