function logout() {
  localStorage.removeItem('code');
  localStorage.removeItem('staySignedIn');
  initiateViews();
}
