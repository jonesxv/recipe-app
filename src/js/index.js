import 'bootstrap';
import '../scss/index.scss';
const createCard = require('./elements');
const recipes = require('../public/recipes.js');
const apiKey = require('../config/config');

const numberOfResults = 20;
const ingredients = ['blue cheese', 'sugar', 'flour'];
const ingredientsSearch = addIngredients(ingredients);

function addIngredients(arr) {
  let str = '';
  arr.forEach((item, idx) => {
    if (idx < arr.length - 1) {
      str += `${item}%2C`;
    } else {
      str += item;
    }
  });
  return str;
}

// function formatSearchURL(num, ingredientsArray) {
//   const ingredients = addIngredients(ingredientsArray);
//   return `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=${num}&ranking=1&ignorePantry=false&ingredients=${ingredients}`;
// }

console.log(ingredientsSearch);

function searchIngredients(results = 10) {
  // $.get(`http://www.omdbapi.com/?apikey=${omdb_key}&s=${title}&page=${page}`, function(response) {
  //   // console.log(response)

  //   $('.title-click').on('click', function() {

  //     showTitle(event.target.text)
  //     $('#movie-modal').modal();
  //   })
  // })

  // Uncomment to make API Calls

  // apiCall(formatSearchURL(numberOfResults,ingredients),'GET', function(response) {
  //   console.log(response)
  // $('#recipe-table tr:not(".header")').remove()
  // response.forEach(recipe => {
  //   createCard(recipe);
  // })
  // });

  // Uncomment to get data from JS file

  recipes.forEach(recipe => {
    createCard(recipe);
  });

  console.log(recipes, results);
}

// function apiCall(endURL, method, cb) {
//   if (ingredients) {
//     $.ajax({
//       url: endURL,
//       headers: {
//         'X-RapidAPI-Host':
//           'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
//         'X-RapidAPI-Key': apiKey,
//       },
//       method: method,
//     }).then(res => {
//       cb(res);
//     });
//   }
// }

// apiCall('GET', numberOfResults, ingredientsSearch, function(response) {
//   console.log(response);
// })

searchIngredients(numberOfResults);

console.log(apiKey);

$(document).ready(function() {
  $('.modal-trigger').on('click', function() {
    let target = $(event.target).attr('data-target');
    $(`#${target}`).modal();
  });

  $('.btn-add').on('click', function() {
    let input = $('.ingredients-field').val();
    if (input.length > 0) {
      $('<div>', {
        class: 'added-ingredient',
        text: input,
        click: function() {
          this.remove();
        },
      }).appendTo('.added');
      $('.ingredients-field').val('');
    }
  });

  $('.btn-search').on('click', function() {
    $('.added-ingredient').each(function() {
      ingredients.push(this.innerHTML);
    });
    console.log(ingredients);
  });
});
