/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

fetch('games.json')
  .then(response => response.json())
  .then(games => {
    showCards(games);

    document.getElementById("search-bar").addEventListener("input", function() {
      let filtered = [];
      let query = this.value;
      
      for (let i = 0; i < games.length; i++){
        if (games[i].title.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(games[i]);
        }
      }
      showCards(filtered)

    })

    document.getElementById("sort-select").addEventListener("change", function() {
      let sortValue = this.value;

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
        "difficulty-low": function(a, b) {return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];}
      };

      let sorted = [...games];
      sorted.sort(sortFunctions[sortValue]); 
      
      showCards(sorted);
    })  
    
    document.getElementById("genre-filter").addEventListener("change", function() {
      let genreValue = this.value;
      let filtered = []

      if (genreValue === "all"){
        showCards(games);
        return;
      }

      for (let i = 0; i < games.length; i++){
        if (games[i].genre.includes(genreValue)) {
          filtered.push(games[i])
        }
      }
      showCards(filtered)
    })


    });


function showCards(games) {
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

    if (game.mustPlay) {
      const badge = document.createElement("p");
      badge.textContent = "⭐ Daniel's Must Play";
      const cardContent = nextCard.querySelector(".card-content");
      cardContent.insertBefore(badge, ul);
    }


    nextCard.addEventListener("click", function() {
      if (ul.style.display === "none") {
        ul.style.display = "block";
      }
      else {
        ul.style.display = "none";
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

    

    const statusItem = document.createElement("p");
    statusItem.textContent = "Completion: " + game.status;
    ul.appendChild(statusItem)


    const ratingItem = document.createElement("p");
    if (game.rating == 8){
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