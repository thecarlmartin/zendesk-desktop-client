$(document).ready(function() {

  var remote = require('remote');
  var BrowserWindow = remote.require('browser-window');

});

function startSearch () {
  var searchInput = document.getElementById("search-box").value;
  //Saving Search for later use by View Controller
  localStorage.setItem('searchQuery', searchInput);
  localStorage.setItem('searchSuccess', false);

  if (searchInput !== "") {
    //Starting Search
    var api = ".zendesk.com/api/v2/help_center/articles/search.json";
    var parameters = {query: searchInput};
    zendeskAPICall(api, displayHelpCenterCards, parameters)

    //Reset UI
    loading(true, 'Wir durchsuchen unser Help Center nach Lösungen.');
    hideEverything(true);
    document.getElementById("search-box").value = "";
  } else {
    //Shake search field to indicate a value has to be entered
    $('#search-box').addClass("shake");
    $('#search-box').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
  }
}

//Executes once the API Query has finished and builds the search results view
function displayHelpCenterCards(response) {
  var articles = response.results;
  var articleCount = articles.length;
  localStorage.setItem('searchResults', JSON.stringify(articles));

  //Check if Search has returned any results
  if (articleCount > 0) {

    //Display only the five most relevant Articles
    if(articleCount > 5) {
      articleCount = 5;
    }

    //Displaying Article Cards
    var searchResultsCard = '<p id="search-results-description">Wir haben einige Lösungsvorschläge gefunden:</p>';

    for(i = 0; i < articleCount; i += 1) {
      var resultNumber = i + 1;

      searchResultsCard += [
        '<a href="#" onclick="displayArticle(' + i + '); return false;" class="search-results-card">',
          '<p class="search-results-number">' + resultNumber + '</p>',
          '<p class="search-results-title">' + articles[i].name + '</p>',
        '</a>'
        ].join('');
    }

    //Saving Search Success for later use by View Controller
    localStorage.setItem('searchSuccess', true);

    //Insert Article Cards HTML
    $('div.search-results-insert').html(searchResultsCard);

  } else {

    //Executed if Search unsuccesful, or if no Articles are found
    startTicket();
    localStorage.setItem('searchSuccess', false);
    return;
  }

  loading(false, '')
  $('.search-completed, #header-main').fadeIn();
}

//Display Article Body
function displayArticle(id) {
  $('.search-results-insert').hide();
  var articlesArray = JSON.parse(localStorage.getItem('searchResults'));
  var articlesHTML = '';

  articlesHTML += [
    '<h2>' + articlesArray[id].name + '</h2>',
    '<a href="#" onclick="hideArticle()">Schließen</a>',
    '<p>' + articlesArray[id].body + '</p>'
    ].join('');

  $('.article-insert').toggleClass('article-insert-style');
  $('.article-insert').html(articlesHTML);
}

function hideArticle() {
  $('.article-insert').html('');
  $('.article-insert').toggleClass('article-insert-style');
  $('.search-results-insert').show();
}

function leaveSearchResults() {
  $('.article-insert').html('');
  $('.article-insert').removeClass('article-insert-style');
  $('.search-results-insert').show();
  initiateViews();
}
