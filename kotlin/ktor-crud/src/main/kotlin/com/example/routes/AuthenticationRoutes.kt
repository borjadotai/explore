package com.example.routes

import com.example.dao.users.dao
import com.example.models.dto.UserDTO
import com.example.utils.JWT
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.mindrot.jbcrypt.BCrypt

fun Route.authenticationRoutes() {
    authenticate {
        get("/user") {
            val users = dao.allUsers()
            call.respond(users)
        }
    }

    post("/register") {
        val userDTO = call.receive<UserDTO>()
        val passHash = BCrypt.hashpw(userDTO.password, BCrypt.gensalt())
        if (dao.registerUser(UserDTO(userDTO.username, passHash)))
            call.respond(HttpStatusCode.OK)
        else call.respond(HttpStatusCode.Conflict)
    }
    post("/login") {
        val loginUser = call.receive<UserDTO>()
        val user = dao.getUser(loginUser.username)
        val notAllowed = user == null || !BCrypt.checkpw(loginUser.password, user.password)
        if (notAllowed) {
            call.respond(HttpStatusCode.Unauthorized)
        } else call.respond(hashMapOf("token" to JWT.createJwtToken(user!!.username)))
    }
    delete("/user/{id?}") {
        val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
        val user = dao.deleteUser(id)
        if (user) call.respond(HttpStatusCode.OK) else call.respond(HttpStatusCode.NotFound)
    }
}