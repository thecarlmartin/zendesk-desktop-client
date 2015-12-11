function zendeskAPICall(api, callbackFunction) {
  var request = new XMLHttpRequest();
  var zendeskSubdomain = localStorage.getItem('subdomain');
  var apiURL = 'https://' + zendeskSubdomain + api;
  var authorization = 'Bearer ' + localStorage.getItem('code');

  request.onreadystatechange = function() {
    if(request.readyState == 4 && request.status == 200) {
      var response = JSON.parse(request.responseText);
      callbackFunction(response);
      return;
    } else if(request.readyState == 4 && request.status !== 200) {
      return 'error';
    }
  }

  request.open('GET', apiURL, true);
  request.setRequestHeader("Authorization", authorization);
  request.send();
}

function zendeskAPIPost(api, data, callbackFunction) {
  var request = new XMLHttpRequest();
  var zendeskSubdomain = localStorage.getItem('subdomain');
  var apiURL = 'https://' + zendeskSubdomain + api;
  var authorization = 'Bearer ' + localStorage.getItem('code');

  request.onreadystatechange = function() {
    if(request.readyState == 4 && request.status == 201) {
      var response = JSON.parse(request.responseText);
      callbackFunction(response);
      return;
    } else if(request.readyState == 4 && request.status !== 201) {
      console.log(request);
      return 'error';
    }
  }

  request.open('POST', apiURL, true);
  request.setRequestHeader("Authorization", authorization);
  request.setRequestHeader("Content-Type", 'application/json');
  request.send(JSON.stringify(data));
}
