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
    return recipes_info.map(async (recipe_info) => {
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
            glutenFree: glutenFree , 
        }
    })
  }

  async function getInstructions(id){
    let recapies = await axios.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,

        }
    });
    // console.log(recapies.data[0].steps)
     return recapies.data[0].steps;
}
async function extractInstructions(recipes_info) {
    let arr = [];
  
    for (const recipe_info of recipes_info) {
      let instructions = await getInstructions(recipe_info.id);
      
      let data = recipe_info;
      if (recipe_info.data) {
        data = recipe_info.data;
      }
      
      const { id, title, image } = data;
      arr.push({
        id: id,
        title: title,
        image: image,
        instructions: instructions
      });
    }
  
    return arr;
  }
  
//    function extractInstructions(recipes_info ) {
//     let arr = [];

//     recipes_info.forEach(async (recipe_info , index) => {       
//         let instructions = await getInstructions(recipe_info.id);
//         // getInstructions(recipe_info.id).then((res)=>{
//         //     // console.log(res)
//         //     instructions = res
//         // });
//         // console.log(instructions)
//         //check the data type so it can work with diffrent types of data
//         let data = recipe_info;
//         if (recipe_info.data) {
//             data = recipe_info.data;
//         }
//         const {
//             id,
//             title,
//             image,
//         } = data;
//         arr.push({
//             id: id,
//             title: title,
//             image: image,
//             instructions: instructions
//         });  
//         console.log(arr)
//         if(index == recipes_info.length-1) return arr
//     })
//   }

async function getRecipeBySearch(searchResult , number){
    //https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2
    // if(!num){
    //     num = 5;
    // }
    let recapies = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey ,
            number : number ? number : 5 , //5 by default
            query : searchResult
        }
    });
   console.log(recapies.data.results)
//    return recapies.data.results
    const info = extractInstructions(recapies.data.results)
    return info

}

exports.getRecipeDetails = getRecipeDetails;
exports.getAllRecapies = getAllRecapies;
exports.getRecipeBySearch = getRecipeBySearch;


