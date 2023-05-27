const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
  await DButils.execQuery(
    `INSERT INTO favorite_recipes (user_id, recipe_id) VALUES ('${user_id}'
    , '${recipe_id}')`
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

async function updateRecipePopularity(user_id,recipe_id, action) {
   const currentQuery= await DButils.execQuery(`select popularity from recipes_popularity where recipe_id='${recipe_id}'`);
   const current = currentQuery.length === 0 ? 0 : currentQuery[0].popularity;
    if(action==1){

    }

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
exports.updateRecipePopularity = updateRecipePopularity;
