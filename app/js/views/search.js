function startSearch () {
  var searchInput = document.getElementById("search-box").value;
  if (searchInput !== "") {
    loading(true, 'Wir durchsuchen unser Help Center nach Lösungen.')
    //!!!!!!!!!!!!!!!!!!!!!
    hideEverything();
    searchHelpCenter(searchInput);
  } else {
    $('#search-box').addClass("shake");
    $('#search-box').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
  }
}

function searchHelpCenter (searchString) {
  var api = ".zendesk.com/api/v2/help_center/articles/search.json?query=" + searchString
  zendeskAPICall(api, displayHelpCenterCards)
}

function displayHelpCenterCards(response) {
  var articles = response.results;
  articleCount = articles.length;
  if (articleCount > 0) {
    if(articleCount > 5) {
      articleCount = 5;
    }
    var searchResultsCard = '';
    for(i = 0; i < articleCount; i += 1) {
      var resultNumber = i + 1;
      searchResultsCard += [
        '<a href="" class="search-results-card" onclick="displayArticle(' + i + '); return false;">',
          '<p class="search-results-number">' + resultNumber + '</p>',
          '<p class="search-results-title">' + articles[i].name + '</p>',
        '</a>'
        ].join('');
    }
    $('.search-results-insert').html(searchResultsCard);
  } else {
    createTicket();
    return;
  }
  console.log(response);
  loading(false, '')
  $('.search-completed').fadeIn();
}
