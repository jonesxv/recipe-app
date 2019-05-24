const keys = require('../config/config');
// const recipeData = require('../public/recipeData');

function apiCall(endURL, method, cb) {
  $.ajax({
    url: endURL,
    headers: {
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      'X-RapidAPI-Key': keys.apiKey,
    },
    method: method,
  }).then(res => {
    cb(res);
  });
}
// console.log(recipeData);

function createElement(key, val) {
  console.log(key);
  if (val === true) {
    let el = $(`<span class="tags">${key}</span>`);
    $('#modal-tags').append(el);
    console.log('tags ' + key);
  } else if (key === 'image') {
    let img = $(`<img src=${val}>`);
    $('#modal-img').prepend(img);
  } else if (key === 'Ratings') {
    val.forEach(rating => {
      console.log(rating);
      let el = $(
        `<p><strong>${rating.Source}: </strong><span class="output">${
          rating.Value
        }</span></p>`
      );
      $('#modal-rating').append(el);
    });
  } else if (key === 'title') {
    $('#recipe-title').text(val);
  } else if (key === 'extendedIngredients') {
    for (let i = 0; i < val.length; i++) {
      $('#ing-list').append(
        $(`<li class="list-group-item ing-list-item">${val[i].name}</li>`)
      );
    }
  } else if (val === null || val.length === 0) {
    console.log(`${key} is null`);
  } else if (key === 'instructions') {
    let el = $(`<ul class="list-group"></ul>`);
    el.append(
      $('<li class="list-group-item"><strong>Instructions</strong></li>')
    );
    el.append($(`<li class="list-group-item"><strong>${val}</strong></li>`));
    $('#modal-instructions').append(el);
  } else if (val !== false) {
    let el = $(
      `<p><strong>${key}: </strong><span class="output">${val}</span></p>`
    );
    $('#output').append(el);
  }
}

function showRecipe(response) {
  $('.container-recipe img').remove();
  $('#modal-tags').empty();
  $('#modal-instructions').empty();
  $('.ing-list-item').remove();
  $('#output').empty();
  for (let key in response) {
    createElement(key, response[key]);
  }
}

function createCard(obj, user, addRecipeCB) {
  const $title = $('<h4>', { class: 'card-title' });
  const $image = $('<img>', { class: 'card-img-top', src: obj.image });
  const $save = $('<div>', {
    class: 'btn save',
    key: obj.id,
    text: 'save',
    click: function() {
      console.log(user);
      addRecipeCB(user, obj);
    },
  });
  $save.text('save');
  const $cardBody = $('<div>', {
    class: 'card-body card-body-cascade text-center',
  });
  const $cardHead = $('<div>', { class: 'view view-cascade overlay' });
  const $cardItem = $('<div>', { class: 'card-item', key: obj.id });
  const $card = $('<div>', { class: 'card', key: obj.id });
  $cardHead.append($image);

  $cardBody.append($title);
  $cardItem.append($cardHead);
  $cardItem.append($cardBody);
  $card.append($cardItem);
  $card.append($save);

  $title.text(obj.title);
  $cardItem.click(function(event) {
    const recipeInfoURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${event.currentTarget.getAttribute(
      'key'
    )}/information`;
    console.log(recipeInfoURL);

    // Uncomment to make API calls
    apiCall(recipeInfoURL, 'GET', function(response) {
      console.log(response);
      showRecipe(response);
      $('#recipe-modal').modal();
    });

    // Uncomment to get data from file instead
    // showRecipe(recipeData);
    // $('#recipe-modal').modal();
    // console.log(recipeData);
  });

  $('.recipe-cards').append($card);
}

module.exports = createCard;
