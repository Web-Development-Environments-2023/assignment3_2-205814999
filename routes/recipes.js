var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// router.get("/", async (req, res) => {
//   try {
//     const recipes = await recipes_utils.getAllRecapies();
//     res.send(recipes);//send to client all recipes
//   } catch (error) {
//     res.send(error)
//   }
// });

router.get("/:recipeId/instructions", async (req, res, next) => {
  try {
    const instructions = await recipes_utils.getInstructions(req.params.recipeId);
    res.send(instructions);
  } catch (error) {
    next(error);
  }
});

router.get("/:recipeId/ingredients", async (req, res, next) => {
  try {
    const ingredients = await recipes_utils.getIngredientsAndAmountByID(req.params.recipeId);
    res.send(ingredients);
  } catch (error) {
    next(error);
  }
});
router.get("/:recipeId/servings", async (req, res, next) => {
  try {
    const servings = await recipes_utils.getServings(req.params.recipeId);
    res.send(servings);
  } catch (error) {
    next(error);
  }
});
//, req.body.cuisine, req.body.diet, req.body.intolerance
router.get("/recipe/search", async (req, res, next) => {
  console.log("lol");
  try {
    const query = req.query.query;
    const limit = req.query.limit;
    const cuisine = req.query.cuisine || null;
    const diet = req.query.diet || null;
    const intolerance = req.query.intolerance || null;
    const recipes = await recipes_utils.getRecipeBySearch(query, limit, cuisine, diet, intolerance);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/recipe/random", async (req, res) => {
  console.log("lolawhawhwah");
  try {
    const recipes = await recipes_utils.getRandomRecipes();
    res.send(recipes);//send to client all recipes
  } catch (error) {
    res.send(error)
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
