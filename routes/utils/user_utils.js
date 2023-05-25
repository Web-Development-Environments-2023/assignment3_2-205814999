const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favorite_recipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favorite_recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsWatched(user_id, recipe_id, watched_at){
    await DButils.execQuery(
        `INSERT INTO watched_recipes (user_id, recipe_id, watched_at) VALUES ('${user_id}'
        , '${recipe_id}', '${watched_at}')`
      );   
}

async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from watched_recipes where user_id='${user_id}' ORDER BY watched_at DESC LIMIT 3`);
    return recipes_id;
}

async function getMyRecipes(user_id){
    const recipes = await DButils.execQuery(`select * from created_recipes where user_id='${user_id}'`);
    return recipes;
}

async function createRecipe(user_id,title,image,readyInMinutes,vegetarian,vegan,gluten_free,products_and_quantities,instructions,number_of_servings){
    const result = await DButils.execQuery(
        `INSERT INTO created_recipes (user_id, title, image ,readyInMinutes, vegetarian, vegan, gluten_free, products_and_quantities, instructions, number_of_servings)
         VALUES ('${user_id}', '${title}', '${image}','${readyInMinutes}', '${vegetarian}', '${vegan}', '${gluten_free}', '${products_and_quantities}', '${instructions}', '${number_of_servings}');
         SELECT LAST_INSERT_ID() AS created_recipe_id;`
      );
    const created_recipe_id = result[1][0].created_recipe_id;      
    await DButils.execQuery(
    `INSERT INTO recipes_popularity (recipe_id) VALUES ('${created_recipe_id}')`
    );  
}

async function getRecipePopularity(recipe_id) {
    const getQuery = `select popularity from recipes_popularity where recipe_id='${recipe_id}'`;
    const popularity = await DButils.execQuery(updateQuery);
    if (popularity.length === 0) {
        // Recipe ID doesn't exist
        return null;
      }
    return popularity;
  }

async function updateRecipePopularity(recipe_id, popularity) {
    const updateQuery = `UPDATE recipes_popularity SET popularity = ${popularity} WHERE recipe_id = ${recipe_id}`;
    const updateResult = await DButils.execQuery(updateQuery);
    // if recipe id doesnt exist than insert
    if (updateResult.affectedRows === 0) {
      const insertQuery = `INSERT INTO recipes_popularity (recipe_id, popularity) VALUES (${recipe_id}, ${popularity})`;
      await DButils.execQuery(insertQuery);
    }
  }

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getMyRecipes = getMyRecipes;
exports.createRecipe = createRecipe;
exports.getRecipePopularity = getRecipePopularity;
exports.updateRecipePopularity = updateRecipePopularity;
