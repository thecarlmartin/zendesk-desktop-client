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
  var userInfo = new XMLHttpRequest();
  var zendeskSubdomain = localStorage.getItem('subdomain');
  var apiURL = 'https://' + zendeskSubdomain + '.zendesk.com/api/v2/users/me.json';
  var authorization = 'Bearer ' + localStorage.getItem('code');

  userInfo.onreadystatechange = function() {

    if (userInfo.readyState == 4 && userInfo.status == 200) {
      var response = JSON.parse(userInfo.responseText);
      localStorage.setItem('userID', response.user.id);
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      $('#logout').text('Nicht ' + localStorage.getItem('userName') + '? Abmelden')
      $('.footer').fadeIn();
    } else if(userInfo.readyState == 4 && userInfo.status !== 200) {
      alert('Wir konnten Ihre Identität nicht verifizieren. Bitte prüfen Sie Ihre Internetverbindung und melden Sie sich erneut an.')
      logout();
      initiateViews();
    }
  };

  userInfo.open('GET', apiURL, true);
  userInfo.setRequestHeader("Authorization", authorization);
  userInfo.send();
}
