let nowSearch = "";
let nowGenre = "all";
let nowSort = "default";
let nowMustPlay = false;

fetch('games.json')
  .then(response => response.json())
  .then(games => {
    showCards(games);

    document.getElementById("search-bar").addEventListener("input", function() {
      nowSearch = this.value;
      applyUserChanges(games);
    })

    document.getElementById("sort-select").addEventListener("change", function() {
      nowSort = this.value;
      applyUserChanges(games);
    })  
    
    document.getElementById("genre-filter").addEventListener("change", function(){
      nowGenre = this.value;
      applyUserChanges(games);
    })

    document.getElementById("mustplay-filter").addEventListener("click", function(){
      nowMustPlay = !nowMustPlay;
      this.classList.toggle("active");
      applyUserChanges(games);  
    });


  });

function applyUserChanges(games){
  let result = [...games];

  if (nowSearch){
    result = result.filter(function(game){
      return game.title.toLowerCase().includes(nowSearch.toLowerCase());
    });
  }

  if (nowGenre !== "all"){
    result = result.filter(function(game){
      return game.genre.includes(nowGenre);
    });
  }

  if (nowMustPlay){
    result = result.filter(function(game) {
      return game.mustPlay === true;
    });
  }

  if (nowSort !== "default") {
    const difficultyRank = {
      "Plays Itself": 1,
      "Enjoy the Story": 2,
      "Hold Your Breath": 3,
      "Monitor Breaker": 4
    };
    
    const sortFunctions = {
      "rating-high": function(a, b) {return b.rating - a.rating;},
      "rating-low": function(a, b) {return a.rating - b.rating;},
      "difficulty-high": function(a, b) {return difficultyRank[b.difficulty] - difficultyRank[a.difficulty];},
      "difficulty-low": function(a, b) {return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];},
      "release-latest": function(a, b) {return b.releaseYear - a.releaseYear;},
      "release-oldest": function(a, b) {return a.releaseYear - b.releaseYear;}
    };
    
    result.sort(sortFunctions[nowSort]);
  }

showCards(result);


}


function showCards(games) {
  
  document.getElementById("game-count").textContent = "Showing " + games.length + " games";
  
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  for (let i = 0; i < games.length; i++){
    let game = games[i];
    
    const nextCard = templateCard.cloneNode(true);
    nextCard.style.display = "block";
    
    const title = nextCard.querySelector("h2");
    title.textContent = game.title;

    const image = nextCard.querySelector("img");
    image.src = game.coverArt

    const ul = nextCard.querySelector("ul");
    ul.innerHTML = "";
    ul.style.display = "none";

    const cardContent = nextCard.querySelector(".card-content");

    if (game.mustPlay) {
      const badge = document.createElement("p");
      badge.textContent = "⭐ Daniel's Must Play";
      badge.style.color = "#FFFC00";
      cardContent.insertBefore(badge, ul);
    }

    const dateItem = document.createElement("p");
    dateItem.textContent = "Release: " + game.releaseYear
    cardContent.insertBefore(dateItem, ul)

    const devItem = document.createElement("p");
    devItem.textContent = "Developer: " + game.developer
    cardContent.insertBefore(devItem, ul)

    const hint = document.createElement("p");
    hint.textContent = "Click to Expand";
    hint.className = "expand-hint";
    cardContent.insertBefore(hint, ul);


    nextCard.addEventListener("click", function() {
      if (ul.style.display === "none") {
        ul.style.display = "block";
        hint.textContent = "Click to Collapse"
      }
      else {
        ul.style.display = "none";
        hint.textContent = "Click to Expand"
      }
    });

    

    const genreItem = document.createElement("p");
    genreItem.textContent = "Genre: " + game.genre.join(", ");
    ul.appendChild(genreItem)

  
    
    
    const difficultyItem = document.createElement("p");
    difficultyItem.textContent = "Difficulty: " + game.difficulty
    
    const difficultyColors = {
      "Plays Itself": "difficulty-easy",
      "Enjoy the Story": "difficulty-medium",
      "Hold Your Breath": "difficulty-hard",
      "Monitor Breaker": "difficulty-extreme"
      };

    difficultyItem.className = difficultyColors[game.difficulty];
    ul.appendChild(difficultyItem);

    const timeItem = document.createElement("p");
    timeItem.textContent = "Playtime: " + game.playtime + "hrs +"
    ul.appendChild(timeItem)

    const statusItem = document.createElement("p");
    statusItem.textContent = "Completion: " + game.status;
    ul.appendChild(statusItem)


    const ratingItem = document.createElement("p");
    if (game.rating === 8){
      ratingItem.textContent = "Rating: It's a Byte!"
    }
    else {
    ratingItem.textContent = "Rating: " + game.rating + "bits" + " out of Byte";
    }
    ul.appendChild(ratingItem);   


    const reviewItem = document.createElement("p");
    reviewItem.textContent = "Review: " + game.review
    ul.appendChild(reviewItem)


    
    cardContainer.appendChild(nextCard);
  }

}