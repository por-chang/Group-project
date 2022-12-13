
// variables for free dictionary random facts
// random fact display- will need to change after html
var fact = document.getElementById('display-fact')
var factTitle = document.getElementById('search-heading')
var mealInst = document.getElementById('meal-inst')
var mealHeading = document.getElementById('meal-heading')
var mealLook = document.getElementById('meal-look')
var mealImage = document.getElementById('meal-img')
// fact returned from api
var selectedFact= "";
// fact stored in local storage
var storedFact = [];
// search meal button
var searchButton = document.getElementById('search-btn');
var randomButton = document.getElementById('randon-meal');
var searchHistoryButton = document.getElementById('search-history');
var clearHistoryButton = document.getElementById('clear-history');
var historyList = document.getElementById('thelist')


// user supplied input
var userInput = document.getElementById('search-field');

var statusCode = ""

function init(){
    console.log("We are starting")
}

init()

// the searchButton event Listener pushes random fact + meal history to local storage
searchButton.addEventListener('click', function(event){
    event.preventDefault();

    //random fact object
    var randomFact = {
       searchInput: userInput.value.trim(),
        };

    storedFact.push(randomFact)
    localStorage.setItem("facts", JSON.stringify(storedFact))

    getFact();
    });

function getFact() {
    // console.log("get fact function called")
    // clear each element in the form + cards
    mealImage.innerHTML = ""
    mealInst.innerHTML = ""
    fact.innerHTML = ""
    mealLook.innerHTML = ""
    mealInst.innerHTML = ""
    mealHeading.innerHTML = ""
    historyList.innerHTML = ""  
    factTitle.innerHTML = ""
    // console.log(Math.floor(Math.random() * 100))

    if (userInput.value === "") {
        fact.innerHTML = "Please provide input to search. You can try our awesome Random Generator Meal option."
        return;
    }

    var requestUrl = 
    'https://api.dictionaryapi.dev/api/v2/entries/en/'+userInput.value


    fetch(requestUrl)
        .then(function (response) {
            console.log(response)
            statusCode = response.status
            return response.json();
        })

        .then(function (data) {
            if (statusCode == 200 ) {
                console.log(data)
                var word = data[0]
                // console.log(word)
                var definition = data[0].meanings[0].definitions[0].definition
                // console.log(definition)
                // push data
                fact.innerHTML = definition;
                factTitle.innerHTML = "Random fact for " + userInput.value
                mealSearch()
                userInput.value = ""
                
            } 
            if (statusCode == 404 ) {
                // console.log("Failed")
                fact.innerHTML = "Sorry pal, we couldn’t find the meaning for the word you were looking for."
                mealLook.innerHTML = "Here is a Pokemon for you!"
                mealSearch()
                randompokemonSearch()
                factTitle.innerHTML = "Random fact for " + userInput.value

            }
        })
        .catch(error => {
            fact.innerHTML = "Something went wrong. Please try after sometime."
            userInput.value = ""
        })
}


function mealSearch() {
    console.log("Meal Search function called.")

    var mealUrl = 
    'https://themealdb.com/api/json/v1/1/search.php?s=' + userInput.value


    fetch(mealUrl)
        .then(function (response) {
            statusCode = response.status
            console.log(response)
            return response.json();
        })

        .then(function (data) {

        if (statusCode == 200 && data) {
            console.log(data["meals"][0])
            mealInst.innerHTML = data["meals"][0]["strInstructions"]
            mealHeading.innerHTML = "Meal Instructions for " + data["meals"][0]["strMeal"]
            mealImage.innerHTML = "<img src=" + data["meals"][0]["strMealThumb"] + ">"
            mealLook.innerHTML = "How my meal looks."
            
        } 
        if (statusCode == 404 ) {
            // console.log("Failed")
            mealInst.innerHTML = "Sorry pal, we couldn’t find meal/receipe Instructions for the word you were looking for."
            mealHeading.innerHTML = "Meal Instructions not found!"
            mealLook.innerHTML = "Here is a Pokemon for you!"
            randompokemonSearch()
        }
    })
    .catch(error => {
        mealInst.innerHTML = "Sorry pal, we couldn’t find meal/receipe Instructions for the word you were looking for. We are adding new meal receipe to our repo. Request you to comeback after sometime."
        mealHeading.innerHTML = "Meal Instructions not found in API!"
        mealLook.innerHTML = "Here is a Pokemon for you!"
        randompokemonSearch()
    })
}



randomButton.addEventListener('click', function(event){
    event.preventDefault();

    //random fact object
    var randomFact = {
       searchInput: userInput.value.trim(),
        };
    randomMealGenerator();
    });



function randomMealGenerator() {
    console.log("Random Meal Search function called.")
    historyList.innerHTML = ""
    fact.innerHTML = ""

    var mealUrl = 'https://themealdb.com/api/json/v1/1/random.php'


    fetch(mealUrl)
        .then(function (response) {
            statusCode = response.status
            console.log(response)
            return response.json();
        })

        .then(function (data) {

        if (statusCode == 200 && data) {
            console.log(data["meals"][0])
            mealInst.innerHTML = data["meals"][0]["strInstructions"]
            mealHeading.innerHTML = "Meal Instructions for " + data["meals"][0]["strMeal"]
            mealImage.innerHTML = "<img src=" + data["meals"][0]["strMealThumb"] + ">"
            mealLook.innerHTML = "How my meal looks."
            factTitle.innerHTML = "Random fact for " + data["meals"][0]["strMeal"].trim()
            console.log(data["meals"][0]["strMeal"].trim())
            
        } 
        if (statusCode == 404 ) {
            // console.log("Failed")
            mealInst.innerHTML = "Sorry pal, we couldn’t find meal/receipe Instructions for the word you were looking for."
            mealHeading.innerHTML = "Meal Instructions not found!"
            factTitle.innerHTML = "No random fact available for " + data["meals"][0]["strMeal"].trim()
            console.log(data["meals"][0]["strMeal"].trim())
        }
    })
    .catch(error => {
        mealInst.innerHTML = "Sorry pal, we couldn’t find meal/receipe Instructions for the word you were looking for. We are adding new meal receipe to our repo. Request you to comeback after sometime."
        mealHeading.innerHTML = "Meal Instructions not found in API!"
        mealLook.innerHTML = "Here is a Pokemon for you!"
        randompokemonSearch()
    })

}


function randompokemonSearch() {
    var randomNumber = Math.floor(Math.random() * 100)
    var pokemonurl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+ randomNumber + '.png'
    mealImage.innerHTML = "<img src=" + pokemonurl + ">"
}


searchHistoryButton.addEventListener('click', function(event){
    event.preventDefault();
    searchHistory();
    });

    
function searchHistory() {
    var historySearch = JSON.parse(localStorage.getItem("facts"))
    historyList.innerHTML = ""
    // console.log(historySearch)
    for (var i = 0 ; i < historySearch.length; i++) {
        // console.log(historySearch[i]["searchInput"])
        historyList.innerHTML += "<li>" + historySearch[i]["searchInput"] + "</li>"
    }
    searchHistoryButton.classList.toggle(hist);
}

clearHistoryButton.addEventListener('click', function(event){
    event.preventDefault();
    clearHistory()
    });

    
function clearHistory() {
    historyList.innerHTML = ""
    localStorage.clear()
    var clearStorage = {
        searchInput: null,
         };
 
     clearFact.push(clearStorage)
     localStorage.setItem("facts", JSON.stringify(clearFact))
}
