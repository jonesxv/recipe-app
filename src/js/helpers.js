const apiKey = require('../config/config');

function apiCall(endURL, method, cb) {
  $.ajax({
    url: endURL,
    headers: {
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      'X-RapidAPI-Key': apiKey,
    },
    method: method,
  }).then(res => {
    cb(res);
  });
}

module.exports = {
  apiCall: apiCall,
};
