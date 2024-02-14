package com.example.dao.articles

import com.example.models.*
import com.example.models.dto.*

interface ArticleDAOFacade {
    suspend fun articlesByUser(userId: Int): List<Article>?
    suspend fun article(id: Int): Article?
    suspend fun addNewArticle(createDTO: ArticleCreateDTO): Article?
    suspend fun updateArticle(updateDTO: ArticleUpdateDTO): Boolean
    suspend fun deleteArticle(id: Int): Boolean
}