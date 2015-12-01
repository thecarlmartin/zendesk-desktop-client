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
  zendeskAPICall(api, handleHelpCenterResults)
}

function handleHelpCenterResults(response) {
  var articles = response.results;
  var resultsHTML = '';
  var descriptionText = '';
  if(articles.length > 0) {
    if(articles.length === 1) {
      descriptionText += 'Wir haben in unserem Help Center eine Antwort gefunden';
    } else if (articles.length > 1) {
      descriptionText += 'Wir haben in unserem Help Center mehrere Antworten gefunden';
    }

    for(i = 0; i < articles.length; i += 1) {
      resultsHTML += '<a href="" class="help-center-article" onclick="openHCArticle(' + i + '); return false;">' + articles[i].name + '</a>';
    }

  console.log(resultsHTML);
  $('.help-center-description').text(descriptionText);
  $('.help-center-articles').html(resultsHTML);
  }












  console.log(articles.length);


  console.log(response);
  loading(false, '')
  $('.search-completed').fadeIn();
}
