package com.example.dao.users

import com.example.models.*
import com.example.models.dto.*

interface UserDAOFacade {
    suspend fun allUsers(): List<User>
    suspend fun registerUser(userDTO: UserDTO): Boolean
    suspend fun getUser(username: String): User?
    suspend fun deleteUser(id: Int): Boolean
}