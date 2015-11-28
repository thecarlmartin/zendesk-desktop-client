function logout() {
  localStorage.removeItem('code');
  localStorage.removeItem('staySignedIn');
  localStorage.removeItem('subdomain');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userID');
  hideEverything();
  $('.login').fadeIn("slow");
}


function requestUserInfo() {
  var api = '.zendesk.com/api/v2/users/me.json';
  var userInfo = zendeskAPICall(api, handleUserInfo);
}

function handleUserInfo (response) {
  if (response === 'error') {
    alert('Wir konnten Ihre Identität nicht verifizieren. Bitte prüfen Sie Ihre Internetverbindung und melden Sie sich erneut an.')
    logout();
    initiateViews();
  } else {
    localStorage.setItem('userID', response.user.id);
    localStorage.setItem('userName', response.user.name);
    localStorage.setItem('userEmail', response.user.email);
    $('#logout').text('Nicht ' + localStorage.getItem('userName') + '? Abmelden')
    $('.footer').fadeIn();
  }
}
