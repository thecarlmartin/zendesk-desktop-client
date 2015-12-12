function fetchRequests() {
  var requester_id = localStorage.getItem('userID');
  var parameters = {sort_by: 'updated_at', sort_order: 'desc'}
  var api = '.zendesk.com/api/v2/users/' + requester_id + '/requests.json';
  zendeskAPICall(api, displayRequests, parameters);
  loading(true, 'Wir rufen Ihre Anfragen ab.');
  hideEverything(false);
}

function displayRequests(response) {
  var requests = response.requests;
  var requestCard = '<p id="request-list-description">Folgende Anfragen haben Sie uns bereits gestellt:</p>';
  var status = '';
  var statusClass ='';

  for(i = 0; i < requests.length; i +=1) {
    //Determine Request status
    status = requests[i].status;
    if(status === 'solved' || status === 'closed') {
      statusClass = 'request-solved';
      status = 'Gelöst';
    } else {
      statusClass = 'request-open';
      status = 'Offen';
    }

    requestCard += [
      '<a href="#" onclick="openRequest(' + i + ')" class="request-card ' + statusClass + '">',
          '<h2>' + requests[i].subject + '</h2>',
          '<p class="request-status">' + status + '</p>',
          '<span><p class="request-description">' + requests[i].description + '</p></span>',
      '</a>'
    ].join('');
  }

  $('.requests').html(requestCard);
  loading(false, '');
  $('.requests').show();
}
