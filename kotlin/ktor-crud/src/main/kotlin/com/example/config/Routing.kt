package com.example.config

import com.example.routes.*
import io.ktor.server.routing.*
import io.ktor.server.application.*

fun Application.configureRouting() {
    routing {
        articleRoutes()
    }
}
