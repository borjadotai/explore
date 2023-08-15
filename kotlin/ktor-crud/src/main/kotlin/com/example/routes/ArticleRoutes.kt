package com.example.routes

import com.example.dao.articles.dao
import com.example.models.dto.ArticleCreateDTO
import com.example.models.dto.ArticleUpdateDTO
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.articleRoutes() {
    authenticate {
        route("/article") {
            get {
                val articles = dao.allArticles() ?: call.respond(HttpStatusCode.NotFound)
                call.respond(HttpStatusCode.OK, articles)
            }
            get("{id?}") {
                val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
                val article = dao.article(id) ?: call.respond(HttpStatusCode.NotFound)
                call.respond(HttpStatusCode.OK, article)
            }
            post {
                val receivedArticle = call.receive<ArticleCreateDTO>()
                val article = dao.addNewArticle(receivedArticle) ?: call.respond(HttpStatusCode.BadRequest)
                call.respond(HttpStatusCode.Created, article)
            }
            put {
                val receivedArticle = call.receive<ArticleUpdateDTO>()
                val updatedArticle = dao.updateArticle(receivedArticle)
                if (updatedArticle) call.respond(HttpStatusCode.OK) else call.respond(HttpStatusCode.BadRequest)
            }
            delete("{id?}") {
                val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
                val article = dao.deleteArticle(id)
                if (article) call.respond(HttpStatusCode.OK) else call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}