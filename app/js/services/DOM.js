function setFormText(id, add, text) {
  var selectedForm = document.getElementById(id);
  if (add === 'add') {
    selectedForm.value = selectedForm.value + text;
  } else {
    selectedForm.value = text;
  }
}

function changeTextColor(id, color) {
  document.getElementById(id).style.color = color;
}

function hideEverything() {
  $('.search-feature, #header-main, .login, .footer, .search-completed, .doneAnimationCanvas').hide();
}

function loading(show, description) {
  if(show === true) {
    $('.loading').fadeIn("slow");
    if(description !== null || description === '') {
      $('#loading-description').text(description);
    }
  } else {
    $('.loading').fadeOut("slow");
  }
}

function doneAnimation() {
  hideEverything();
  $('.doneAnimationCanvas').show();
  function removeDone() {
    setTimeout('initiateViews()', 2000);
  }
  removeDone();
}
