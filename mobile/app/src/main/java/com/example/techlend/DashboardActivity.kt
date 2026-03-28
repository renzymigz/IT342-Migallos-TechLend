package com.example.techlend

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.techlend.auth.SessionManager
import com.example.techlend.network.ApiClient
import com.example.techlend.network.ApiErrorParser
import java.io.IOException
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    private lateinit var btnLogout: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        sessionManager = SessionManager(this)
        btnLogout = findViewById(R.id.btnLogout)

        if (!sessionManager.isLoggedIn()) {
            openLogin()
            return
        }

        setupNavListeners()
        btnLogout.setOnClickListener {
            logoutUser()
        }
    }

    private fun setupNavListeners() {
        findViewById<View>(R.id.navCatalog)?.setOnClickListener {
            // Already on dashboard/catalog.
        }
        findViewById<View>(R.id.navMyLoans)?.setOnClickListener {
            Toast.makeText(this, "My Loans will be available soon.", Toast.LENGTH_SHORT).show()
        }
        findViewById<View>(R.id.navCart)?.setOnClickListener {
            Toast.makeText(this, "Cart will be available soon.", Toast.LENGTH_SHORT).show()
        }
        findViewById<View>(R.id.navProfile)?.setOnClickListener {
            startActivity(Intent(this, ProfileActivity::class.java))
        }
    }

    private fun logoutUser() {
        val token = sessionManager.getAccessToken()
        if (token.isNullOrBlank()) {
            sessionManager.clearSession()
            openLogin()
            return
        }

        lifecycleScope.launch {
            setLogoutLoading(true)
            try {
                val response = ApiClient.authApi.logout("Bearer $token")
                if (!response.isSuccessful || response.body()?.success != true) {
                    val message = ApiErrorParser.getMessage(response, "Logout request failed. Logging out locally.")
                    showToast(message)
                }
            } catch (_: IOException) {
                showToast("Server unavailable. Logging out locally.")
            } catch (_: Exception) {
                showToast("Unexpected error. Logging out locally.")
            } finally {
                sessionManager.clearSession()
                setLogoutLoading(false)
                openLogin()
            }
        }
    }

    private fun openLogin() {
        startActivity(
            Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
        )
        finish()
    }

    private fun setLogoutLoading(isLoading: Boolean) {
        btnLogout.isEnabled = !isLoading
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()

    }
}