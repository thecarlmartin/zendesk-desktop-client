$(document).ready(function() {

  // Login Form activity
  setFormText("subdomain-field", 'add', 'beispiel');

  $('#subdomain-field').focus(function(){
    //Setting the elements to blue to indicate focus
    changeTextColor("subdomain-textabove", "#4A90E2");
    changeTextColor("subdomain-field", "#4A90E2");
    changeTextColor("subdomain-completion", "#4A90E2");
    document.getElementById("subdomain-field").style.borderBottom = "0.1em solid #4A90E2";

    //Remove placeholder text, if applicable
    if (document.getElementById("subdomain-field").value === 'beispiel') {
      setFormText("subdomain-field", '', '');
    }
  });

  $('#subdomain-field').blur(function(){
    //Changing the elements back to normal color to communicate end focus
    changeTextColor("subdomain-textabove", "#A1A1A1");
    changeTextColor("subdomain-field", "#A1A1A1");
    changeTextColor("subdomain-completion", "#A1A1A1");
    document.getElementById("subdomain-field").style.borderBottom = "0.1em solid #A1A1A1";

    //Check if user entered domain, otherwise fill in placeholder text
    if (document.getElementById("subdomain-field").value === '') {
      setFormText("subdomain-field", 'add', 'beispiel');
    }

    //Listen for Enter key in search box
    $('#search-box').bind('enterKey', function(e) {
      startSearch();
    });
  });
});
