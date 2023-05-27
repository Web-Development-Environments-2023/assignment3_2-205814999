
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorite_recipes;
DROP TABLE IF EXISTS created_recipes;
DROP TABLE IF EXISTS watched_recipes;
DROP TABLE IF EXISTS recipes_popularity;
DROP TABLE IF EXISTS user_recipes_popularity;

CREATE TABLE users(  
    user_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    username VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    country VARCHAR(255),
    hash_password VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE favorite_recipes (
  favorite_recipe_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
  user_id INT NOT NULL,
  recipe_id INT NOT NULL
);
CREATE TABLE created_recipes(  
    created_recipe_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    user_id INT NOT NULL,
    title VARCHAR(255),
    image VARCHAR(255),
    readyInMinutes INT,
    vegeterian BOOLEAN,
    vegan BOOLEAN,
    gluten_free BOOLEAN,
    ingridients JSON,
    instructions JSON,
    servings INT
);

CREATE TABLE watched_recipes(  
  watched_recipe_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  watched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes_popularity(  
  recipe_id int NOT NULL PRIMARY KEY COMMENT 'Primary Key',
  popularity INT DEFAULT 0
);

CREATE TABLE user_recipes_popularity(  
  popular_recipe_id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
  user_id INT NOT NULL,
  recipe_id INT NOT NULL
);
