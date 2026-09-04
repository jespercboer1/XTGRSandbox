DROP DATABASE IF EXISTS kattennamen_systeem;
CREATE DATABASE kattennamen_systeem;

USE kattennamen_systeem;


-- ============================================
-- Gebruikers
-- ============================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    passcode CHAR(5) NULL,
    passcode_created_at TIMESTAMP NULL
);

INSERT INTO users (username)
VALUES
('Jesper'),
('Elianne'),
('Carin'),
('Arjan');


-- ============================================
-- Individuele kattennamen
-- ============================================

CREATE TABLE cat_names (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    submitted_by INT NOT NULL,

    FOREIGN KEY (submitted_by)
        REFERENCES users(id)
);


-- ============================================
-- Stemmen op individuele namen
-- ============================================

CREATE TABLE cat_name_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    cat_name_id INT NOT NULL,

    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),

    UNIQUE(user_id, cat_name_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (cat_name_id)
        REFERENCES cat_names(id)
);


-- ============================================
-- Tussenstand individuele namen
-- (snapshot na het stemmen)
-- ============================================

CREATE TABLE cat_name_results (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cat_name_id INT NOT NULL,

    jesper_score TINYINT,
    elianne_score TINYINT,
    carin_score TINYINT,
    arjan_score TINYINT,

    average_score DECIMAL(3,2) NOT NULL,

    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cat_name_id)
        REFERENCES cat_names(id)
);


-- ============================================
-- Namen die doorgaan naar ronde 2
-- ============================================

CREATE TABLE selected_cat_names (
    cat_name_id INT PRIMARY KEY,

    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cat_name_id)
        REFERENCES cat_names(id)
);


-- ============================================
-- Duo namen
-- ============================================

CREATE TABLE duo_names (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cat_name_1 INT NOT NULL,
    cat_name_2 INT NOT NULL,

    created_by INT NOT NULL,

    UNIQUE(cat_name_1, cat_name_2),

    FOREIGN KEY (cat_name_1)
        REFERENCES cat_names(id),

    FOREIGN KEY (cat_name_2)
        REFERENCES cat_names(id),

    FOREIGN KEY (created_by)
        REFERENCES users(id)
);


-- ============================================
-- Stemmen op duo namen
-- ============================================

CREATE TABLE duo_name_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    duo_name_id INT NOT NULL,

    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),

    UNIQUE(user_id, duo_name_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (duo_name_id)
        REFERENCES duo_names(id)
);


-- ============================================
-- Eindresultaat duo namen
-- (snapshot)
-- ============================================

CREATE TABLE duo_name_results (
    id INT AUTO_INCREMENT PRIMARY KEY,

    duo_name_id INT NOT NULL,

    jesper_score TINYINT,
    elianne_score TINYINT,
    carin_score TINYINT,
    arjan_score TINYINT,

    average_score DECIMAL(3,2) NOT NULL,

    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (duo_name_id)
        REFERENCES duo_names(id)
);