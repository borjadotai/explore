package com.example.dao.articles

import com.example.models.*
import com.example.models.dto.ArticleCreateDTO
import com.example.models.dto.ArticleUpdateDTO
import org.jetbrains.exposed.sql.*
import kotlinx.coroutines.runBlocking
import com.example.utils.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class ArticleDAOFacadeImpl : ArticleDAOFacade {
    private fun resultRowToArticle(row: ResultRow) = Article(
        id = row[Articles.id],
        title = row[Articles.title],
        body = row[Articles.body],
    )

    override suspend fun allArticles(): List<Article> = dbQuery {
        Articles.selectAll().map(::resultRowToArticle)
    }

    override suspend fun article(id: Int): Article? = dbQuery {
        Articles
            .select { Articles.id eq id }
            .map(::resultRowToArticle)
            .singleOrNull()
    }

    override suspend fun addNewArticle(createDTO: ArticleCreateDTO): Article? = dbQuery {
        val insertStatement = Articles.insert {
            it[Articles.title] = createDTO.title
            it[Articles.body] = createDTO.body
        }
        insertStatement.resultedValues?.singleOrNull()?.let(::resultRowToArticle)
    }

    override suspend fun updateArticle(updateDTO: ArticleUpdateDTO): Boolean = dbQuery {
        Articles.update({ Articles.id eq updateDTO.id }) { row ->
            updateDTO.title?.let { row[Articles.title] = it }
            updateDTO.body?.let { row[Articles.body] = it }
        } > 0
    }


    override suspend fun deleteArticle(id: Int): Boolean = dbQuery {
        Articles.deleteWhere { Articles.id eq id } > 0
    }
}

val dao: ArticleDAOFacade = ArticleDAOFacadeImpl().apply {
    runBlocking {
        if(allArticles().isEmpty()) {
            addNewArticle(ArticleCreateDTO("The drive to develop!", "...it's what keeps me going."))
        }
    }
}