// Zendesk Application credentials
var options = {
    client_id: 'desktop_support',
    client_secret: 'cd4669093075abdce1bd997953983885a75b8a9d35eb44d22179f6e304a9ceb5',
    scopes: ["read%20write"], // Scopes limit access for OAuth tokens.
    redirectURI: 'https://physiotherapiemartin.de'
};

function zendeskOAuth() {

  if(document.getElementById("subdomain-field").value === '' || document.getElementById("subdomain-field").value === 'beispiel.zendesk.com') {
    return;
  }

  // Build the OAuth consent page URL
  var authWindow = newWindow(800, 600, false);
  var zendeskURL = 'https://' + document.getElementById("subdomain-field").value + '/oauth/authorizations/new';
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

    // If there is a code in the callback, proceed to get token from Zendesk
    if (code) {
      requestGithubToken(options, code);
    } else if (error) {
      alert("Oops! Something went wrong and we couldn't log you in using Github. Please try again.");
    }

  });

  // Reset the authWindow on close
  authWindow.on('close', function() {
      authWindow = null;
  }, false);

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
