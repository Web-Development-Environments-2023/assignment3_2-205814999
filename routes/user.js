var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const { DateTime } = require("mssql");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // ????? const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
router.post('/lastwatched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const watched_at = new Date();
    await user_utils.markAsWatched(user_id,recipe_id,watched_at);
    res.status(200).send("The Recipe successfully saved as watched");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the last 3 watched recipes by the logged-in user
 */
router.get('/lastwatched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let watched_recipes = {};
    const recipes_id = await user_utils.getLastWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // ???? const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the users created recipes
 */
router.get('/myrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // ???? const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
router.post('/createrecipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const title = req.body.title;
    const image = req.body.image
    const readyInMinutes = req.body.readyInMinutes;
    const vegeterian = req.body.vegeterian;
    const vegan = req.body.vegan;
    const gluten_free = req.body.gluten_free;
    const products_and_quantities = req.body.products_and_quantities;
    const instructions = req.body.instructions;
    const number_of_servings= req.body.number_of_servings;

    await user_utils.createRecipe(user_id,title,image,readyInMinutes,vegeterian,vegan,gluten_free,products_and_quantities,instructions,number_of_servings);
    res.status(200).send("The Recipe successfully created");
    } catch(error){
    next(error);
  }
})


module.exports = router;
