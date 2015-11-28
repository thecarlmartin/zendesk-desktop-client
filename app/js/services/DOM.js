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
  $('.search-feature, .header, .login, .loading, .footer').hide();
}

function loading(show) {
  if(show === true) {
    $('.loading').fadeIn("slow");
  } else {
    $('.loading').fadeOut("slow");
  }
}
