-- Active: 1675099318197@@127.0.0.1@3306

CREATE TABLE videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration NUMBER NOT NULL,
    upload_date TEXT DEFAULT(DATETIME())NOT NULL
);

INSERT INTO videos(id, title, duration)
VALUES
    ("v001", "Trailer Piratas do Caribe", 15),
    ("v002", "Trailer Sherlock Homes", 12),
    ("v003", "Trailer Homem Aranha 2", 10);

SELECT * FROM videos;

DROP TABLE videos;