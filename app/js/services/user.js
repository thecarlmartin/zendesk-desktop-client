function logout() {
  localStorage.removeItem('code');
  localStorage.removeItem('staySignedIn');
  localStorage.removeItem('subdomain');
  localStorage.removeItem('userEmail');
  initiateViews();
}


function requestUserInfo() {
  loading(true);
  var userInfo = new XMLHttpRequest();
  var zendeskSubdomain = localStorage.getItem('subdomain');
  var apiURL = 'https://' + zendeskSubdomain + '.zendesk.com/api/v2/users/me.json';
  var authorization = 'Bearer ' + localStorage.getItem('code');
  console.log(authorization);

  userInfo.onreadystatechange = function() {
    if (userInfo.readyState == 4 && userInfo.status == 200) {
      var response = JSON.parse(userInfo.responseText);
      console.log(response);
      localStorage.setItem('userID', response.user.id);
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      console.log('User Name: ' + localStorage.getItem('userName'));
      console.log('User ID: ' + localStorage.getItem('userID'));
      console.log('User Email: ' + localStorage.getItem('userEmail'));
      $('#logout').text('Nicht ' + localStorage.getItem('userName') + '? Abmelden')
      loading(false);
    }
  };

  userInfo.open('GET', apiURL, true);
  userInfo.setRequestHeader("Authorization", authorization);
  userInfo.send();
}
