package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class User(val id: Int, val username: String, val password: String)

object Users : Table() {
    val id = integer("id").autoIncrement()
    val username = varchar("username", 100)
    val password = varchar("password", 100)

    override val primaryKey = PrimaryKey(id)
}