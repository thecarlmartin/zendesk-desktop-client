$(document).ready(function() {
  $('#make-request-subject').focus(function(){
    if (document.getElementById("make-request-subject").value === 'Bitte geben Sie einen Betreff ein.') {
      setFormText("make-request-subject", '', '');
    }
    changeTextColor("make-request-subject", "#757575");
  });

  $('#make-request-body').focus(function(){
    if (document.getElementById("make-request-body").value === 'Bitte beschreiben Sie Ihr Problem ein wenig genauer') {
      setFormText("make-request-body", '', '');
    }
    changeTextColor("make-request-body", "#757575");
  });
});

function startTicket() {
  loading(false, '');
  var query = localStorage.getItem('searchQuery');
  hideEverything();
  $('.make-request, #header-main').show();
  setFormText('make-request-subject', false, query);
  setFormText('make-request-body', false, '');
}

function returnToSearch() {
  if(localStorage.getItem('searchSuccess') === 'true') {
    $('.make-request').hide();
    $('.search-completed').show();
  } else {
    initiateViews();
  }
}

function createTicket() {
  var subject = document.getElementById('make-request-subject').value;
  var comment = document.getElementById('make-request-body').value;
  var requester_id = localStorage.getItem('userID');

  //Form Validation
  if(subject === "" || comment === "") {
    if(subject === "") {
      document.getElementById('make-request-subject').value = 'Bitte geben Sie einen Betreff ein.';
      changeTextColor("make-request-subject", "#4A90E2");
      $('#make-request-subject').addClass("shake");
      $('#make-request-subject').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
    }
    if(comment === "") {
      document.getElementById('make-request-body').value = 'Bitte beschreiben Sie Ihr Problem ein wenig genauer';
      changeTextColor("make-request-body", "#4A90E2");
      $('#make-request-body').addClass("shake");
      $('#make-request-body').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
    }
    return;
  }

  //Creating a Zendesk Ticket
  loading(true, 'Wir übermitteln Ihre Anfrage');
  var data = {request: {
    subject: subject,
    comment: {body: comment},
    requester_id: requester_id,
    status: 'new'
  }};
  console.log(data);
  var apiURL = '.zendesk.com/api/v2/requests.json';
  zendeskAPIPost(apiURL, data, handleCreatedTicket);

}

function handleCreatedTicket(response) {
  console.log(response);
  alert('Created Ticket');
  loading(false, '');
  doneAnimation();
}
