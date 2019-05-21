// var $div = $("<div>", {id: "foo", "class": "a"});
// $div.click(function(){ /* ... */ });
// $("#box").append($div);

{
  /* <div class="card">
      <div class="view view-cascade overlay">
        <img class="card-img-top" src="https://spoonacular.com/recipeImages/70306-312x231.jpg" alt="Card image cap">
      </div>
      <div class="card-body card-body-cascade text-center">
        <h4 class="card-title"><strong>Easy Cinnamon Apple Pie</strong></h4>
        <h5 class="blue-text pb-2">Ingredients Used: <strong>3</strong></h5>
      </div> 
          </div> */
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
  $card.click(function() {
    console.log(event.currentTarget.getAttribute('key'));
  });

  $('.recipe-cards').append($card);
}

module.exports = createCard;
