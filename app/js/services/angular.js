angular.module("zendeskDesktop", [])

.controller('searchCtrl', function($scope) {

})

.service('dataService', function($http) {

  this.helloWorld = function() {
    console.log('This is the hello console service!');
  }

  this.getTodos = function(callback){
     $http.get('mock/todos.json')
    .then(callback)
  }
});
