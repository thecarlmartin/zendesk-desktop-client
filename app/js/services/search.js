function searchHelpCenter (searchString, subdomain) {
  var helpCenterRequest = new XMLHttpRequest()
  helpCenterRequest.open("GET", "https://" + subdomain + ".zendesk.com/api/v2/help_center/articles/search.json?query=" + searchString, false);
  helpCenterRequest.send();
  return helpCenterRequest;
}

function startSearch () {
  loading(true);
  var searchInput = document.getElementById("search-box").value;
  if (searchInput === "") {
    document.getElementById("search-box").style.borderBottom = "0.25vw solid gray";
    loading(false);
  } else {
    console.log(searchInput);
    document.getElementById("search-box").style.borderBottom = "0.25vw solid white";
    var searchResults = searchHelpCenter(searchInput, 'physiotherapiemartin');
    console.log(searchResults);
  }
}
