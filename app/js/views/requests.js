// This package manages the handling of all requests for a given user, inlcuding displaying their history

//This function calls the zendeskAPICall
function fetchRequests() {
  var hiddenLoad = localStorage.getItem('hiddenLoad');
  var requester_id = localStorage.getItem('userID');
  var parameters = {sort_by: 'updated_at', sort_order: 'desc'}
  var api = '.zendesk.com/api/v2/users/' + requester_id + '/requests.json';
  zendeskAPICall(api, saveRequests, parameters);
  //If this function has been invoked automatically open requests are not shown automatically to the user
  if(hiddenLoad != 'true') {
    loading(true, 'Wir rufen Ihre Anfragen ab.');
    hideEverything(false);
  } else {
    localStorage.setItem('hiddenLoad', 'false');
  }
}

//Once the API Call is completed, the following function handles the response based on previously defined parameters
function saveRequests(response) {
  var requests = response.requests;
  var display = localStorage.getItem('displayRequests');
  var notify = localStorage.getItem('notifyUser');
  localStorage.setItem('requestsObject', JSON.stringify(requests));
  if(display != 'false') {
    displayRequests();
    localStorage.setItem('displayRequests', 'true');
  }
  //The user is notified about new request, when the user invoked the function directly
  if(notify === 'true') {
    notifyUser();
    localStorage.setItem('notifyUser', 'false');
    localStorage.setItem('displayRequests', 'true');
  }
}

//This function creates the necessary HTML and inserts it in index.html
function displayRequests() {
  var requests = JSON.parse(localStorage.getItem('requestsObject'));
  var requestCard = '';

  if(requests.length > 1) {
    requestCard += '<p id="request-list-description">Folgende Anfragen haben Sie uns bereits gestellt. Gelöste Anfragen sind grün markiert.</p>';
    var status = '';
    var statusClass ='';
    var readClass = '';

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

      //Check if request has been read
      var readStatus = checkIfRead(i);
      if(readStatus === 'read') {
        var readText = 'Gelesen';
      } else {
        var readText = 'Ungelesen';
      }

      requestCard += [
        '<a href="#" onclick="openRequest(' + i + ')" class="request-card ' + statusClass + '">',
          '<h2>' + requests[i].subject + '</h2>',
          '<p class="request-status ' + readStatus + '">' + readText + '</p>',
          '<span><p class="request-description">' + requests[i].description + '</p></span>',
        '</a>'
      ].join('');

    }
  } else {
    requestCard += '<p id="request-list-description">Sie haben noch keine Anfragen gestellt.</p>'
  }
  $('.requests').html(requestCard);
  loading(false, '');
  $('.requests').show();
}

//This functions counts all unread messages. Whether a request has been opened since it has been last updated is determined by the function checkIfRead()
function countUnread() {
  var count = 0
  var requests = JSON.parse(localStorage.getItem('requestsObject'));
  if(requests === null) {
    return 0;
  }
  for (var i = 0; i < requests.length; i++) {
    var status = checkIfRead(i);
    if(status === 'unread') {
      count += 1;
    }
  }
  $("#requests").text("Anfragen (" + count + " neu)");
  return count;
}

function checkIfRead(index) {
  //Determine, if request has been read since updated
  var lastRead = JSON.parse(localStorage.getItem('lastRead'));
  var requests = JSON.parse(localStorage.getItem('requestsObject'));
  var requestId = requests[index].id;

  var lastReadAt = null;
  if(lastRead[requestId] === undefined) {
    return 'unread';
  } else {
    var readDate = new Date(lastRead[requestId])
    var updateDate = new Date(requests[index].updated_at)
    if(readDate.getTime() >= updateDate.getTime()) {
      return 'read';
    } else {
      return 'unread';
    }
  }
}

function checkForUpdates() {
  localStorage.setItem('hiddenLoad', 'true');
  localStorage.setItem('notifyUser', 'true');
  localStorage.setItem('displayRequests', 'false');
  fetchRequests();
}

//This function uses Electron's API to send a native destop notification on Windows and Mac OS X
function notifyUser() {
  var unread = countUnread();
  if(unread > 0) {
    var myNotification = new Notification('Praxissupport', {
      body: 'Sie haben neue, ungelesene Nachrichten von unserem Support Team'
    });

    myNotification.onclick = function () {
      fetchRequests();
    }
  }
}

//This function makes a Zendesk API Call to gather all all comments to a given request
function openRequest(i) {
  var requests = JSON.parse(localStorage.getItem('requestsObject'));
  var requestID = requests[i].id;
  var api = '.zendesk.com/api/v2/requests/' + requestID + '/comments.json';
  var parameters = {sort_by: 'created_at', sort_order: 'asc'};
  zendeskAPICall(api, displayRequestComments, parameters);

  var requestSubject = requests[i].subject;
  localStorage.setItem('requestSubject', requestSubject);
  localStorage.setItem('requestID', requestID);
  localStorage.setItem('requestIndex', i);
}

//Handles response from Zendesk, creates necessary HTML and inkects it into the template
function displayRequestComments(response) {
  var subject = localStorage.getItem('requestSubject');
  var comments = response.comments;
  var users = response.users;
  var userID = '';
  var userName = '';
  var cssName = '';
  var cssComment = '';

  hideEverything(false);
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

  var requestId = localStorage.getItem('requestID');
  var currentTime = new Date().getTime();
  var lastRead = JSON.parse(localStorage.getItem('lastRead'));
  lastRead[requestId] = currentTime;
  localStorage.setItem('lastRead', JSON.stringify(lastRead));
}

//Linked to back button, when request is opened and handles the transition back to the request overview
function returnToRequests() {
  hideEverything(false);
  countUnread();
  displayRequests();
}

//Submits a new comment to Zendesk
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
  openRequest(localStorage.getItem('requestIndex'));
}
