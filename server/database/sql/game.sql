CREATE TABLE game(
    id              SERIAL PRIMARY KEY, 
    game_name       VARCHAR(64),
    game_code       VARCHAR(64),
    p1_code         VARCHAR(64),
    p2_code         VARCHAR(64),
    turn            CHAR,
    checked         CHAR,
    checkmated      CHAR,
    board_config    TEXT
)