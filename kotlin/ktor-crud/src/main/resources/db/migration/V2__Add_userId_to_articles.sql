-- src/main/resources/db/migration/V2__Add_userId_to_articles.sql
ALTER TABLE Articles ADD COLUMN userId INT;
ALTER TABLE Articles ADD FOREIGN KEY (userId) REFERENCES Users(id);