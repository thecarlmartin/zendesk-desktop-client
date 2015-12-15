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
  var requestCard = '';

  if(requests.length > 1) {
    requestCard += '<p id="request-list-description">Folgende Anfragen haben Sie uns bereits gestellt:</p>';
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
      localStorage.setItem('requestsObject', JSON.stringify(requests));
    }
  } else {
    requestCard += '<p id="request-list-description">Sie haben noch keine Anfragen gestellt.</p>'
  }
  $('.requests').html(requestCard);
  loading(false, '');
  $('.requests').show();
}

function openRequest(i) {
  var requests = JSON.parse(localStorage.getItem('requestsObject'));
  var requestID = requests[i].id;
  var api = '.zendesk.com/api/v2/requests/' + requestID + '/comments.json';
  var parameters = {sort_by: 'created_at', sort_order: 'asc'};
  zendeskAPICall(api, displayRequestComments, parameters);

  var requestSubject = requests[i].subject;
  localStorage.setItem('requestSubject', requestSubject);
  localStorage.setItem('requestID', requestID);

}

function displayRequestComments(response) {
  var subject = localStorage.getItem('requestSubject');
  var comments = response.comments;
  var users = response.users;
  var userID = '';
  var userName = '';
  var cssName = '';
  var cssComment = '';

  hideEverything(false);
  console.log(subject);
  console.log(comments.length);
  var commentsHTML = [
    '<h2 class="request-comments-subject">' + subject + '</h2>',
    '<a href="#" alt="Go Back" onclick="returnToRequests(); return false;" id="back-button-comments">',
      '<img src="img/arrow-right-blue.svg" class="horizontal-align">',
      '<p class="horizontal-align">Zurück</p>',
    '</a>',
    '<div class="request-comments-container">',
    ].join('');

  for(i = 0; i < comments.length; i +=1 ) {
    userID = comments[i].author_id;

    //Check whether comment was made by agent or user to set the correct css classes
    for(index = 0; index < users.length; index += 1) {
      if(userID === users[index].id) {
        userName = users[index].name;
        if(users[index].agent === true) {
          cssName = 'comment-name-agent';
          cssComment = 'comment-agent';
        } else {
          cssName = 'comment-name-user';
          cssComment = 'comment-user';
        }
      }
    }
    console.log(comments[i].body);
    commentsHTML += [
      '<p class="' + cssName + '">' + userName + '</p>',
      '<div class="' + cssComment + '">',
        '<p>' + comments[i].body + '</p>',
      '</div>'
    ].join('');

  }
  commentsHTML += [
    '</div>',
    '<form class="comment-new">'
  ].join('');
  commentsHTML += '<textarea id="comment-new-textarea" rows="10" cols="1" placeholder="Geben Sie hier weitere Details zu Ihrer Anfrage ein. Ein Mitglied unseres Supportteams wird umgehend antworten."></textarea>';
  commentsHTML += [
      '<a href="#" alt="Send Comment" onclick="sendComment(); return false;">',
        '<p>Senden</p>',
      '</a>',
    '</form>'
  ].join('');

  $('.request-comments').html(commentsHTML);
  $('.request-comments').show();
}

function returnToRequests() {
  hideEverything(false);
  $('.requests').show();
}

function sendComment() {
  loading(true, 'Wir übermitteln Ihren neuen Kommentar');
  var newComment = document.getElementById('comment-new-textarea').value;
  var requestID = localStorage.getItem('requestID');
  var api = '.zendesk.com/api/v2/requests/' + requestID + '.json'
  if(newComment.length > 1) {
    var data = {request: {
        comment: {body: newComment}
      }
    };
    zendeskAPIPost(api, data, handleCommentSent, 'PUT');
  }
}

function handleCommentSent(response) {
  loading(false, '');
  hideEverything(true);
  doneAnimation();
}
