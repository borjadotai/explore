package com.example.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class UserDTO(val username: String, val password: String)