const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
//, cuisine, diet, intolerance

async function getRecipeBySearch(query , limit, cuisine, diet, intolerance){
    let info = [];
    let queryParams = {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
      number: limit || 5, // 5 by default
      query: query,
    };
  
    // Add optional parameters if provided
    if (cuisine) {
      queryParams.cuisine = cuisine;
    }
    if (diet) {
      queryParams.diet = diet;
    }
    if (intolerance) {
      queryParams.intolerances = intolerance;
    }
  
    let recapies = await axios.get(`${api_domain}/complexSearch`, {
      params: queryParams,
    });
  
    for (const recipe_info of recapies.data.results) {
      const recipeDetails = await getRecipeDetails(recipe_info.id);
      info.push(recipeDetails);
    }
  
    return info;
}

async function getRecipeDetailsArr(recipes_id) {
    let recipes = [];
    // Map over the recipes_id array and create an array of promises
    let promises = recipes_id.map(element => getRecipeDetails(element)); 
    // Wait for all promises to resolve
    recipes = await Promise.all(promises);
    return recipes;
}

async function getRecipeDetails(recipe_id) {
    console.log("Getting details of:"+recipe_id);
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, vegan, vegetarian, glutenFree} = recipe_info.data;
    let populairty = await getRecipePopularityFromDB(recipe_id);
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        popularity:populairty ? populairty[0].popularity : 0
    }
}
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getInstructions(recipe_id) {
    let instructionToReturn = []
    let instruction = await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
        }
        });
    for (const step of instruction.data[0].steps) {
        const numberOfStep = step.number;
        const textOfInstru = step.step;
        const compliteInstru = numberOfStep + ". " + textOfInstru;
        instructionToReturn.push(compliteInstru);
    
    }
    return instructionToReturn
    }

async function getIngredientsAndAmountByID(recipe_id) {
    let IngredientsAndAmount = await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    let ingsToReturn = []
    for (const ing of IngredientsAndAmount.data.ingredients) {
        const unit = ing.amount.metric.unit;
        const value = ing.amount.metric.value;
        const name = ing.name;
        const unitValueAndName = value + unit + " " + name;
        ingsToReturn.push(unitValueAndName);
    }
    return ingsToReturn;
}
async function getRecipePopularityFromDB(recipe_id) {
    const getQuery = `select popularity from recipes_popularity where recipe_id='${recipe_id}'`;
    const popularity = await DButils.execQuery(getQuery);
    if (popularity.length === 0) {
        // Recipe ID doesn't exist
        return null;
      }
    return popularity;
  }

async function getServings(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    const servings = recipe_info.data.servings;
    return {number_of_servings:servings};
}

async function getRandomRecipes() {
        let recapies = await axios.get(`${api_domain}/random`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey ,
            number : 3
        }
    });
    let info = [];
    for (const recipe_info of recapies.data.recipes) {
        const recipeDetails = await getRecipeDetails(recipe_info.id);
        info.push(recipeDetails);
      }
    return info
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeBySearch = getRecipeBySearch;
exports.getInstructions = getInstructions;
exports.getIngredientsAndAmountByID = getIngredientsAndAmountByID;
exports.getServings = getServings;
exports.getRecipeDetailsArr = getRecipeDetailsArr;
exports.getRandomRecipes = getRandomRecipes;
        













        
    

// async function getAllRecapies() {

//     let recapies = await axios.get("https://api.spoonacular.com/recipes/random", {
//         params: {
//             includeNutrition: false,
//             apiKey: process.env.spooncular_apiKey ,
//             number : 1
//         }
//     });
//     const info = extractPreviewRecipeDetails(recapies.data.recipes)
//     // console.log(recapies.data.recipes.length)
//     return info
   
// }

// function extractPreviewRecipeDetails(recipes_info) {
//     return recipes_info.map(async (recipe_info) => {
//         //check the data type so it can work with diffrent types of data
//         let data = recipe_info;
//         if (recipe_info.data) {
//             data = recipe_info.data;
//         }
//         const {
//             id,
//             title,
//             readyInMinutes,
//             image,
//             aggregateLikes,
//             vegan,
//             vegetarian,
//             glutenFree,
//         } = data;
//         return {
//             id: id,
//             title: title,
//             image: image,
//             readyInMinutes: readyInMinutes,
//             popularity: aggregateLikes,
//             vegan: vegan,
//             vegetarian: vegetarian,
//             glutenFree: glutenFree , 
//         }
//     })
//   }
  
    
// return recapies.data[0].steps;
  
// async function extractInstructions(recipes_info) {
//     let arr = [];
  
//     for (const recipe_info of recipes_info) {
//       let instructions = await getInstructions(recipe_info.id);
//       if (recipe_info.data){
//         let data = getRecipeDetails(recipes_info.id)
//       }
//     console.log(recipes_info.id)
//     //   let data = recipe_info;
//     //   if (recipe_info.data) {
//     //     data = recipe_info.data;
//     //   }
      
//     //   const { id, title, image } = data;
//       arr.push({
//         data : data ,
//         instructions: instructions
//       });
//     }
//     return arr;
//   }



