$(document).ready(function() {
  //Hiding UI on start
  $('.search-feature, .header-main, .login').hide();
  initiateViews();
});

function initiateViews() {
  var oAuthToken = localStorage.getItem('code');
  console.log(oAuthToken);

  if(oAuthToken != null) {
    $('.login').fadeOut();
    $('.search-feature, .header-main').fadeIn();
  } else {
    localStorage.removeItem('staySignedIn');
    localStorage.removeItem('code')
    $('.login').fadeIn();
  }
}
