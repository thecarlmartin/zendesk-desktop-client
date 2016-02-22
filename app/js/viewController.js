var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

$(document).ready(function() {
  if(localStorage.getItem('staySignedIn') !== 'true') {
    logout();
  } else {
    requestUserInfo();
  }
});

function initiateViews() {
  hideEverything();
  if(localStorage.getItem('code') != null) {
    $('.search-feature, .header, .footer').fadeIn("slow");
    $("#search-box").focus();
  } else {
    logout();
    return;
  }
}

function closeWindow() {
  var window = remote.getCurrentWindow();
  window.on('close', function() {
      window = null;
  }, false);
  window.close();
}

var checkUpdates = setInterval(checkForUpdates, 900000);
