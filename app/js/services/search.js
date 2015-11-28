function searchHelpCenter (searchString, subdomain) {
  var helpCenterRequest = new XMLHttpRequest()
  helpCenterRequest.open("GET", "https://" + subdomain + ".zendesk.com/api/v2/help_center/articles/search.json?query=" + searchString, false);
  helpCenterRequest.send();
  return helpCenterRequest;
}

function startSearch () {
  var searchInput = document.getElementById("search-box").value;
  if (searchInput === "") {
    $('#search-box').addClass("shake");
    $('#search-box').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
  } else {

    console.log(searchInput);
    var searchResults = searchHelpCenter(searchInput, 'physiotherapiemartin');
    console.log(searchResults);
  }
}
