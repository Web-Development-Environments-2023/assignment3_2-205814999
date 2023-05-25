var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", async (req, res) => {
  try {
    const recipes = await recipes_utils.getAllRecapies();
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
//, req.body.cuisine, req.body.diet, req.body.intolerance
router.post("/search", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeBySearch(req.body.search,
       req.body.limit);
    
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
