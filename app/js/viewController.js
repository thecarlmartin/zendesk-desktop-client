$(document).ready(function() {
  if(localStorage.getItem('staySignedIn') !== 'true') {
    logout();
  } else {
    requestUserInfo();
  }
});

function startApp() {
  if(localStorage.getItem('code') != null) {
    $('.search-feature, .header').fadeIn("slow");
  } else {
    logout();
    return;
  }
}

function initiateViews() {
  hideEverything();
  if(localStorage.getItem('code') != null) {
    $('.search-feature, .header, .footer').fadeIn("slow");
  } else {
    logout();
    return;
  }
}
