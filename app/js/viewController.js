$(document).ready(function() {
  if(localStorage.getItem('staySignedIn') !== 'true') {
    logout();
  } else {
    initiateViews();
  }
});

function initiateViews() {
  hideEverything();
  console.log(localStorage.getItem('code'));

  if(localStorage.getItem('code') != null) {
    $('.login').fadeOut("slow");
    requestUserInfo();
    $('.search-feature, .header').fadeIn("slow");
  } else {
    logout();
    return;
  }
}
