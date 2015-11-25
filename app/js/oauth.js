//Document Functions
function removeCookie(window, cookie) {
    var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
    window.webContents.session.cookies.remove({
            "url": url,
            "name": cookie.name
        },
        function(error) {
            if (error) throw error;
        });
}

//Require Browser Module
var remote = require('remote');
var BrowserWindow = remote.require('browser-window');

// Zendesk Application credentials
var options = {
    client_id: 'desktop_support',
    client_secret: 'cd4669093075abdce1bd997953983885a75b8a9d35eb44d22179f6e304a9ceb5',
    scope: "read%20write", // Scopes limit access for OAuth tokens.
    redirectURI: 'https://physiotherapiemartin.de'
};

function zendeskOAuth() {

  if(document.getElementById("subdomain-field").value === '' || document.getElementById("subdomain-field").value === 'beispiel') {
    return;
  } else {
    var zendeskSubdomain = document.getElementById("subdomain-field").value;
  }

  // Build the OAuth consent page URL
  var authWindow = new BrowserWindow({
      height: 800,
      width: 600,
      show: false,
      alwaysOnTop: true
  });
  var zendeskURL = 'https://' + zendeskSubdomain + '.zendesk.com/oauth/authorizations/';
  var authUrl = zendeskURL + 'new?response_type=code&redirect_uri=' + options.redirectURI + '&client_id=' + options.client_id + '&scope=' + options.scope;
  //Remove Zendesk Cookies
  authWindow.webContents.session.cookies.get({}, function(error, cookies) {
    if (error) throw error;
    for (var i = cookies.length - 1; i >= 0; i--) {
        removeCookie(authWindow, cookies[i])
    };
  });
  authWindow.loadUrl(authUrl);
  authWindow.show();

  // Handle the response from Zendesk
  authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {

    var raw_code = /code=([^&]*)/.exec(newUrl) || null,
      code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
      error = /\?error=(.+)$/.exec(newUrl);

    if (code || error) {
      // Close the browser if code found or error
      authWindow.close();
    }

    // If there is a code in the callback, proceed to get token from Zendesk
    if (code) {
      requestZendeskToken(options, code);
    } else if (error) {
      alert("Leider ist ein Fehler aufgetreten. Wir konnten Sie deshalb nicht mit Zendesk anmelden. Bitte versuchen Sie es erneut oder kontaktieren Sie Ihren Administrator.");
    }

  });

  // Reset the authWindow on close
  authWindow.on('close', function() {
      authWindow = null;
  }, false);
}

function requestZendeskToken(zendeskOptions, authCode) {
  var tokenExchange = new XMLHttpRequest();
  var zendeskSubdomain = document.getElementById("subdomain-field").value;
  var tokenURL = 'https://' + zendeskSubdomain + '.zendesk.com/oauth/tokens';
  var tokenOptions = JSON.stringify({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: zendeskOptions.client_id,
    client_secret: zendeskOptions.client_secret,
    redirect_uri: zendeskOptions.redirectURI,
    scope: 'read'
  });

  tokenExchange.onreadystatechange = function() {
    if (tokenExchange.readyState == 4 && tokenExchange.status == 200) {
      var response = JSON.parse(tokenExchange.responseText);
      localStorage.setItem('code', response.access_token);
      console.log('Access Token: ' + response.access_token);
    }
  };

  tokenExchange.open('POST', tokenURL, true);
  tokenExchange.setRequestHeader("Content-Type", "application/json");
  tokenExchange.send(tokenOptions);
}
