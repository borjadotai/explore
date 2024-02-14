package com.example.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class ArticleCreateDTO(
    val title: String,
    val body: String,
    val userId: Int
)

@Serializable
data class ArticleUpdateDTO(
    val id: Int, // This is required since you need to know which article to update
    val title: String? = null, // Optional title update
    val body: String? = null // Optional body update
)