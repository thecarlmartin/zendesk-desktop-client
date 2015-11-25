function setFormText(id, add,text) {
  var selectedForm = document.getElementById(id);
  if (add === 'add') {
    selectedForm.value = selectedForm.value + text;
  } else {
    selectedForm.value = text;
  }
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

$(document).ready(function() {

  console.log(localStorage.getItem('code'))
  if (localStorage.getItem('code') === null || localStorage.getItem('code') === 'undefined' || localStorage.getItem('code') === ''){
    // Hide UI, if User is not logged in.
    $('.search-feature, .header-main').hide();
   } else {
    $('.login').hide();
   }

  // Login Form activity
  setFormText("subdomain-field", 'add', 'beispiel.zendesk.com');

  $('#subdomain-field').focus(function(){
    //Setting the elements to blue to indicate focus
    document.getElementById("subdomain-description").style.color = "#4A90E2";
    document.getElementById("subdomain-field").style.color = "#4A90E2";
    document.getElementById("subdomain-field").style.borderBottom = "0.1em solid #4A90E2";

    //Remove placeholder text, if applicable
    if (document.getElementById("subdomain-field").value === 'beispiel.zendesk.com') {
      setFormText("subdomain-field", '', '');
    }
  });

  $('#subdomain-field').blur(function(){
    //Changing the elements back to normal color to communicate end focus
    document.getElementById("subdomain-description").style.color = "#A1A1A1";
    document.getElementById("subdomain-field").style.color = "#A1A1A1";
    document.getElementById("subdomain-field").style.borderBottom = "0.1em solid #A1A1A1";

    //Check if user entered domain, otherwise fill in placeholder text
    if (document.getElementById("subdomain-field").value === '') {
      setFormText("subdomain-field", 'add', 'beispiel.zendesk.com');
    }

    //Listen for Enter key in search box
    $('#search-box').bind('enterKey', function(e) {
      startSearch();
    });
  });


  function searchHelpCenter (searchString, subdomain) {
    var helpCenterRequest = new XMLHttpRequest()
    helpCenterRequest.open("GET", "https://" + subdomain + ".zendesk.com/api/v2/help_center/articles/search.json?query=" + searchString, false);
    helpCenterRequest.send();
    return helpCenterRequest;
  }

  function startSearch () {
    var searchInput = document.getElementById("search-box").value;
    if (searchInput === "") {
      document.getElementById("search-box").style.borderBottom = "0.25vw solid gray";
    } else {
      console.log(searchInput);
      document.getElementById("search-box").style.borderBottom = "0.25vw solid white";
      var searchResults = searchHelpCenter(searchInput, 'physiotherapiemartin');
      console.log(searchResults);
    }
  }

});
