const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
  await DButils.execQuery(
    `INSERT INTO favorite_recipes (user_id, recipe_id) VALUES ('${user_id}'
    , '${recipe_id}')`
  );  
}

async function removeAsFavorite(user_id, recipe_id){
  await DButils.execQuery(
    `DELETE FROM favorite_recipes WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`
  );  
}

async function checkIfFavorite(user_id, recipe_id){
  const res = await DButils.execQuery(
    `SELECT * FROM favorite_recipes WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`
  );
  if(res.length===0){
    return false;
  } 
  return true; 
}

async function markAsLiked(user_id, recipe_id){
  await DButils.execQuery(
    `INSERT INTO user_recipes_popularity (user_id, recipe_id) VALUES ('${user_id}'
    , '${recipe_id}')`
  );  
}

async function checkIfLiked(user_id, recipe_id){
  const res = await DButils.execQuery(
    `SELECT * FROM user_recipes_popularity WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`
  );
  if(res.length===0){
    return false;
  } 
  return true; 
}

async function removeAsLiked(user_id, recipe_id){
  await DButils.execQuery(
    `DELETE FROM user_recipes_popularity WHERE user_id = '${user_id}' AND recipe_id = '${recipe_id}'`
  );  
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favorite_recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(
        `INSERT INTO watched_recipes (user_id, recipe_id) VALUES ('${user_id}'
        , '${recipe_id}')`
      );   
}

async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from watched_recipes where user_id='${user_id}' ORDER BY watched_at DESC LIMIT 3`);
    return recipes_id;
}

async function getMyRecipes(user_id){
    const recipes = await DButils.execQuery(`
    select created_recipe_id AS id, title, image, readyInMinutes, vegeterian, vegan, gluten_free, ingridients, instructions, servings 
    from created_recipes 
    where user_id='${user_id}'`);
    return recipes;
}

async function createRecipe(user_id,title,image,readyInMinutes,vegeterian,vegan,gluten_free,ingridients,instructions,servings){
  const ingridientsJSON = JSON.stringify(ingridients);
  const instructionsJSON = JSON.stringify(instructions);
    await DButils.execQuery(
        `INSERT INTO created_recipes (user_id, title, image ,readyInMinutes, vegeterian, vegan, gluten_free, ingridients, instructions, servings)
         VALUES ('${user_id}', '${title}', '${image}','${readyInMinutes}', 
         '${vegeterian}', '${vegan}', '${gluten_free}', 
         '${ingridientsJSON}', '${instructionsJSON}', '${servings}');`
      );
}

async function updateRecipePopularity(recipe_id, action) {
  // Check if the action is 'increment' or 'decrement'
  if (action === 'increment') {
    // Increment the popularity of the recipe by 1
    await DButils.execQuery(
      `UPDATE recipes_popularity SET popularity = popularity + 1 WHERE recipe_id = '${recipe_id}'`
    );
  } else if (action === 'decrement') {
    // Decrement the popularity of the recipe by 1
    await DButils.execQuery(
      `UPDATE recipes_popularity SET popularity = popularity - 1 WHERE recipe_id = '${recipe_id}'`
    );
  } else {
    throw new Error('Invalid action provided.');
  }

    // Check if the recipe_id does not exist in the table
    const checkResult = await DButils.execQuery(
      `SELECT recipe_id FROM recipes_popularity WHERE recipe_id = '${recipe_id}'`
    );
  
    if (checkResult.length === 0) {
      // Insert a new row with the recipe_id and set the initial popularity to 1
      await DButils.execQuery(
        `INSERT INTO recipes_popularity (recipe_id, popularity) VALUES ('${recipe_id}', 1)`
      );
    }
}


exports.updateRecipePopularity = updateRecipePopularity;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getMyRecipes = getMyRecipes;
exports.createRecipe = createRecipe;
exports.removeAsFavorite = removeAsFavorite;
exports.checkIfFavorite = checkIfFavorite;
exports.checkIfLiked = checkIfLiked;
exports.removeAsLiked = removeAsLiked;
exports.markAsLiked = markAsLiked;
