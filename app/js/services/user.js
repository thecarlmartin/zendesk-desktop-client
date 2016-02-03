function logout() {
  localStorage.clear();
  hideEverything(false);
  loading(false, '');
  $('.login').fadeIn("slow");
  localStorage.setItem('lastRead', JSON.stringify({}));
}

function requestUserInfo() {
  hideEverything(true);
  loading(true, 'Wir rufen Ihre Informationen ab.');
  var api = '.zendesk.com/api/v2/users/me.json';
  zendeskAPICall(api, handleUserInfo);
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
    $('#logout').text('Nicht ' + localStorage.getItem('userName') + '? Abmelden');
    initiateViews();
    loading(false, '')
  }
}
