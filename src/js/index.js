import 'bootstrap';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import '../scss/index.scss';
const createCard = require('./elements');
const recipes = require('../public/recipes.js');
const keys = require('../config/config');

const numberOfResults = 20;
let ingredients = [];
const ingredientsSearch = addIngredients(ingredients);

// Database configuration

var firebaseConfig = {
  apiKey: keys.dbKey,
  authDomain: 'recipe-app-71197.firebaseapp.com',
  databaseURL: 'https://recipe-app-71197.firebaseio.com',
  projectId: 'recipe-app-71197',
  appId: '1:727744068771:web:e148134171f84d86',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth and Firestore references
const auth = firebase.auth();
// const db = firebase.firestore();

// Firebase Auth listener

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('logged in');
    $('.app').css('display', 'block');
    $('.logged-in').css('display', 'block');
    $('.logged-out').css('display', 'none');
    $('.pre-login').css('display', 'none');
  } else if (user === null) {
    console.log('logged out');
    $('.app').css('display', 'none');
    $('.logged-in').css('display', 'none');
    $('.logged-out').css('display', 'block');
    $('.pre-login').css('display', 'block');
  }
});

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

function formatSearchURL(num, ingredientsArray) {
  const ingredients = addIngredients(ingredientsArray);
  return `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=${num}&ranking=1&ignorePantry=false&ingredients=${ingredients}`;
}

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

  apiCall(formatSearchURL(numberOfResults, ingredients), 'GET', function(
    response
  ) {
    console.log(response);
    $('#recipe-table tr:not(".header")').remove();
    response.forEach(recipe => {
      createCard(recipe);
    });
  });

  // Uncomment to get data from JS file

  // recipes.forEach(recipe => {
  //   createCard(recipe);
  // });

  console.log(recipes, results);
}

function apiCall(endURL, method, cb) {
  if (ingredients) {
    $.ajax({
      url: endURL,
      headers: {
        'X-RapidAPI-Host':
          'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'X-RapidAPI-Key': keys.apiKey,
      },
      method: method,
    }).then(res => {
      cb(res);
    });
  }
}

// apiCall('GET', numberOfResults, ingredientsSearch, function(response) {
//   console.log(response);
// })

// searchIngredients(numberOfResults);

$(document).ready(function() {
  $('.modal-trigger').on('click', function() {
    let target = $(event.target).attr('data-target');
    // $(`#${target}`).modal();
    console.log(target);
    $(`#${target}`).css('display', 'block');
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
    ingredients = [];
    $('.added-ingredient').each(function() {
      ingredients.push(this.innerHTML);
    });
    console.log(ingredients);
    $('.recipe-cards').empty();
    searchIngredients(numberOfResults);
    console.log(ingredients);
  });

  // Sign up modal

  $('#signup-form').submit(function() {
    event.preventDefault();
    // user info
    const email = this['signup-email'].value;
    const password = this['signup-password'].value;
    auth.createUserWithEmailAndPassword(email, password).then(() => {
      $('#signup-email').val('');
      $('#signup-password').val('');
      $('#modal-signup').modal('hide');
    });
  });

  // Login modal

  $('#login-form').submit(function() {
    event.preventDefault();
    const email = this['login-email'].value;
    const password = this['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(() => {
      $('#login-email').val('');
      $('#login-password').val('');
      $('#modal-login').modal('hide');
    });
  });

  // Logout

  $('#logout').on('click', function() {
    event.preventDefault();
    auth.signOut();
  });
});
