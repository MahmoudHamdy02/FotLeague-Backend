-- Create tables
CREATE DATABASE fotleague;

\c fotleague

CREATE TABLE IF NOT EXISTS roles(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    role INT NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS leagues(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    ownerId INT NOT NULL REFERENCES users(id),
    code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS match_status(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    match_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matches(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    home TEXT NOT NULL,
    away TEXT NOT NULL,
    match_status INT NOT NULL REFERENCES match_status(id),
    home_score INT NULL,
    away_score INT NULL,
    season INT NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(id),
    match_id INT NOT NULL REFERENCES matches(id),
    home INT NOT NULL,
    away INT NOT NULL
);

CREATE TABLE IF NOT EXISTS leagues_users(
    user_id INT NOT NULL REFERENCES users(id),
    league_id INT NOT NULL REFERENCES leagues(id),
    PRIMARY KEY(user_id, league_id)
);

CREATE TABLE IF NOT EXISTS scores(
    id INT PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(id),
    league_id INT NOT NULL REFERENCES leagues(id),
    game_week INT NOT NULL
);

-- Insert data
INSERT INTO match_status(match_status) VALUES('upcoming'), ('in progress'), ('played');

INSERT INTO roles(role) VALUES ('admin'), ('user');

INSERT INTO users(email, password, name, role) VALUES ('admin@admin.com', 'admin123', 'admin', 1);

INSERT INTO leagues(name, ownerId, code) VALUES('global', 1, '000000');

INSERT INTO leagues_users(user_id, league_id) VALUES (1, 1);