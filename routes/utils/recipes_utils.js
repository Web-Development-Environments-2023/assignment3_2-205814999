const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
//, cuisine, diet, intolerance



async function getRecipeBySearch(searchResult , limit){
    let info = [];
    let recapies = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey ,
            number : 1 , //5 by default
            query : searchResult
        }
    });
    for (const recipe_info of recapies.data.results) {
        const recipeDetails = await getRecipeDetails(recipe_info.id)
        info.push(recipeDetails)
    }
    
    return info
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    let instruction = await getInstruction(recipe_id);
    let ingredientsAndAmount = await getIngredientsAndAmountByID(recipe_id);
    let servings = await getServings(recipe_id);

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instruction : instruction,
        ingredients : ingredientsAndAmount,
        numberOfServings : servings
        
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

async function getInstruction(recipe_id) {
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
            const unit = await IngredientsAndAmount.data.ingredients[0].amount.metric.unit;
            const value = await IngredientsAndAmount.data.ingredients[0].amount.metric.value;
            const name = await IngredientsAndAmount.data.ingredients[0].name;
            const unitValueAndName = await value + unit + " " + name;

            return unitValueAndName;
        }
        
        async function getServings(recipe_id) {
            let info = await axios.get(`${api_domain}/${recipe_id}/information`, {
                params: {
                    includeNutrition: false,
                    apiKey: process.env.spooncular_apiKey
                }
            });
    
            return info.data.servings;
        }

    exports.getRecipeDetails = getRecipeDetails;
    // exports.getAllRecapies = getAllRecapies;
    exports.getRecipeBySearch = getRecipeBySearch;
        













        
    

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



