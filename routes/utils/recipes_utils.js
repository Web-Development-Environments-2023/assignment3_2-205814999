const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getAllRecapies() {

    let recapies = await axios.get("https://api.spoonacular.com/recipes/random", {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey ,
            number : 15
        }
    });
    const info = extractPreviewRecipeDetails(recapies.data.recipes)
    console.log(recapies.data.recipes.length)
    return info
   
}

function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
  }


async function getRecipeBySearch(searchResult, num){
    //https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2
    // if(!num){
    //     num = 5;
    // }
    let recapies = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey ,
            number : 5 , //5 by default
            query : searchResult
        }
    });
    const info = extractPreviewRecipeDetails(recapies.data.recipes)
    console.log(recapies.data.recipes.length)
    return info

}

exports.getRecipeDetails = getRecipeDetails;
exports.getAllRecapies = getAllRecapies;
exports.getRecipeBySearch = getRecipeBySearch;


