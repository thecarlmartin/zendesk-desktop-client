$(document).ready(function() {
  //Hiding UI on start
  $('.search-feature, .header, .login, .loading, .footer').hide();
  if(localStorage.getItem('staySignedIn') !== 'true') {
    localStorage.removeItem('code');
    localStorage.removeItem('staySignedIn');
  }
  initiateViews();
});

function initiateViews() {
  $('.search-feature, .header, .login, .loading, .footer').hide();
  console.log(localStorage.getItem('code'));

  if(localStorage.getItem('code') != null) {
    $('.login').fadeOut("slow");
    $('.search-feature, .header, .footer').fadeIn("slow");
  } else {
    localStorage.removeItem('staySignedIn');
    localStorage.removeItem('code')
    $('.login').fadeIn("slow");
  }
}

function loading(show) {
  if(show === true) {
    $('.loading').fadeIn("slow");
  } else {
    $('.loading').fadeOut("slow");
  }
}
