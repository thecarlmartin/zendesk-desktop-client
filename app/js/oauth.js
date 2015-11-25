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

  if(document.getElementById("subdomain-field").value === '' || document.getElementById("subdomain-field").value === 'beispiel.zendesk.com') {
    return;
  } else {
    var zendeskSubdomain = document.getElementById("subdomain-field").value;
  }

  // Build the OAuth consent page URL
  //Test new Window function
  var authWindow = new BrowserWindow({
      height: 800,
      width: 600,
      show: false
  });
  var zendeskURL = 'https://' + zendeskSubdomain + '/oauth/authorizations/';
  var authUrl = zendeskURL + 'new?response_type=code&redirect_uri=' + options.redirectURI + '&client_id=' + options.client_id + '&scope=' + options.scope
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

    console.log(code)

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
  var tokenURL = 'https://' + zendeskSubdomain + '/oauth/tokens'
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
      // var token = data.access_token;
      console.log(tokenExchange.responseXML);
    }
  };

  tokenExchange.open('POST', tokenURL, true);
  tokenExchange.setRequestHeader("Content-Type", "application/json");
  console.log(tokenExchange);
  tokenExchange.send(tokenOptions);

  // function saveToken(data) {
  //     var token = data.access_token;
  //     console.log(token);
  // }
  // $.getJSON(tokenURL, tokenOptions, saveToken);
}

// requestGithubToken: function (options, code) {
//
//   apiRequests
//     .post('https://github.com/login/oauth/access_token', {
//       client_id: options.client_id,
//       client_secret: options.client_secret,
//       code: code,
//     })
//     .end(function (err, response) {
//       if (response && response.ok) {
//         // Success - Received Token.
//         // Store it in localStorage maybe?
//         localStorage.setItem('code', response.body.access_token)
//         window.localStorage.setItem('githubtoken', response.body.access_token);
//       } else {
//         // Error - Show messages.
//         console.log(err);
//       }
//     });
//
// }
