package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.Table.Dual.references

@Serializable
data class Article(val id: Int, val title: String, val body: String, val userId: Int)

object Articles : Table() {
    val id = integer("id").autoIncrement()
    val title = varchar("title", 128)
    val body = varchar("body", 1024)
    val userId = integer("userId").references(Users.id)

    override val primaryKey = PrimaryKey(id)
}
