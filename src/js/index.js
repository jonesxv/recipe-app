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
let currentUser = '';

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
const db = firebase.firestore();

// Firebase Auth listener

auth.onAuthStateChanged(user => {
  if (user) {
    $('.app').css('display', 'block');
    $('.logged-in').css('display', 'block');
    $('.logged-out').css('display', 'none');
    $('.pre-login').css('display', 'none');
    currentUser = user.uid;
  } else if (user === null) {
    currentUser = '';
    $('.app').css('display', 'none');
    $('.logged-in').css('display', 'none');
    $('.logged-out').css('display', 'block');
    $('.pre-login').css('display', 'block');
  }
});

// Add user to DB

function addUser(uid, email) {
  db.collection('users')
    .doc(uid)
    .set({
      email: email,
      recipes: [],
    });
}

function addRecipe(uid, recipe) {
  db.collection('users')
    .doc(uid)
    .update({
      recipes: firebase.firestore.FieldValue.arrayUnion(recipe),
    });
}

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
  // Uncomment to make API Calls

  apiCall(formatSearchURL(numberOfResults, ingredients), 'GET', function(
    response
  ) {
    console.log(response);
    $('#recipe-table tr:not(".header")').remove();
    response.forEach(recipe => {
      createCard('api', recipe, currentUser, addRecipe);
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
    $(`#${target}`).css('display', 'block');
    $(`#${target}`).modal();
  });

  $('.btn-add').on('click', function() {
    event.preventDefault();
    let input = $('.ingredients-field').val();
    if (input.length > 0) {
      $('<div>', {
        class: 'added-ingredient btn',
        text: input,
        click: function() {
          this.remove();
        },
      }).appendTo('.added');
      $('.ingredients-field').val('');
    }
    $('.ingredients-field').focus();
  });

  $('.btn-search').on('click', function() {
    ingredients = [];
    $('.added-ingredient').each(function() {
      ingredients.push(this.innerHTML);
    });
    $('.recipe-cards').empty();
    searchIngredients(numberOfResults);
  });

  $('.btn-my-recipes').on('click', function() {
    $('.recipe-cards').empty();
    const recipesRef = db.collection('users').doc(currentUser);
    recipesRef.get().then(function(doc) {
      if (doc.exists) {
        let recipes = doc.data().recipes;
        for (let i = 0; i < recipes.length; i++) {
          createCard('db', recipes[i]);
        }
      } else {
        console.log('No document found');
      }
    });
  });

  // Sign up modal

  $('#signup-form').submit(function() {
    event.preventDefault();
    // user info
    const email = this['signup-email'].value;
    const password = this['signup-password'].value;
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(cred => {
        let uid = cred.user.uid;
        let email = cred.user.email;
        addUser(uid, email);
      })
      .then(() => {
        console.log(`${email} successfully added to firestore`);
        $('#signup-email').val('');
        $('#signup-password').val('');
        $('#modal-signup').modal('hide');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
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

module.exports = {
  db: db,
  auth: auth,
};
