package com.example.dao.users

import com.example.models.*
import com.example.models.dto.UserDTO
import org.jetbrains.exposed.sql.*
import kotlinx.coroutines.runBlocking
import com.example.utils.DatabaseFactory.dbQuery
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class UserDAOFacadeImpl : UserDAOFacade {
    private fun resultRowToUser(row: ResultRow) = User(
        id = row[Users.id],
        username = row[Users.username],
        password = row[Users.password]
    )

    override suspend fun allUsers(): List<User> = dbQuery {
        Users.selectAll().map(::resultRowToUser)
    }

    override suspend fun registerUser(userDTO: UserDTO): Boolean = dbQuery {
        val user = Users.select { Users.username eq userDTO.username }
            .map(::resultRowToUser)
        if (user.isNotEmpty()) return@dbQuery false
        val insertStatement = Users.insert {
            it[Users.username] = userDTO.username
            it[Users.password] = userDTO.password
        }
        insertStatement.resultedValues?.isEmpty() ?: false
    }

    override suspend fun getUser(username: String): User? = dbQuery {
        Users.select { Users.username eq username }
            .map(::resultRowToUser)
            .singleOrNull()
    }

    override suspend fun deleteUser(id: Int): Boolean = dbQuery {
        Users.deleteWhere { Users.id eq id } > 0
    }
}

val dao: UserDAOFacade = UserDAOFacadeImpl()