const apiKey = require('../config/config');
const recipeData = require('../public/recipeData');

// function apiCall(endURL, method, cb) {
//   $.ajax({
//     url: endURL,
//     headers: {
//       'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
//       'X-RapidAPI-Key': apiKey,
//     },
//     method: method,
//   }).then(res => {
//     cb(res);
//   });
// }

console.log(apiKey);

function createElement(key, val) {
  console.log(val);
  if (key === 'image') {
    let img = $(`<img src=${val}>`);
    $('#modal-img').prepend(img);
  } else if (key === 'Ratings') {
    val.forEach(rating => {
      // console.log(rating)
      let el = $(
        `<p><strong>${rating.Source}: </strong><span class="output">${
          rating.Value
        }</span></p>`
      );
      $('#modal-rating').append(el);
    });
  } else if (key === 'title') {
    $('#recipe-title').text(val);
  } else {
    let el = $(
      `<p><strong>${key}: </strong><span class="output">${val}</span></p>`
    );
    $('#output').append(el);
  }
}

function showRecipe(response) {
  $('#output img').remove();
  $('#modal-rating').empty();
  for (let key in response) {
    createElement(key, response[key]);
  }
}

function createCard(obj) {
  const $title = $('<h4>', { class: 'card-title' });
  const $image = $('<img>', { class: 'card-img-top', src: obj.image });
  const $cardBody = $('<div>', {
    class: 'card-body card-body-cascade text-center',
  });
  const $cardHead = $('<div>', { class: 'view view-cascade overlay' });
  const $card = $('<div>', { class: 'card', key: obj.id });
  $cardHead.append($image);
  $cardBody.append($title);
  $card.append($cardHead);
  $card.append($cardBody);

  $title.text(obj.title);
  $card.click(function(event) {
    const recipeInfoURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${event.currentTarget.getAttribute(
      'key'
    )}/information`;
    console.log(recipeInfoURL);

    // Uncomment to make API calls
    // apiCall(recipeInfoURL, 'GET', function(response) {
    //   console.log(response);
    // });

    // Uncomment to get data from file instead
    console.log(recipeData);

    showRecipe(recipeData);
    $('#recipe-modal').modal();
  });

  $('.recipe-cards').append($card);
}

module.exports = createCard;
