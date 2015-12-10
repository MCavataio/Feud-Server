angular.module("feud.home", [])

.controller("HomeController", function($rootScope, $scope, $window, $location, Home, socket) {
  $scope.data = {};
  $scope.socket = 0;
  var room;
  socket.on('playRound', function(response) {
    $location.path('/game');
    $scope.room(response);
  }); 

  $scope.login = function() {
    Home.login($scope.data.user).then(function(user) {

    })
  }

  $scope.createRoom = function() {
    Home.createRoom()
    .then(function(room) {
      // console.log('in create room', room)
      socket.emit('changeRoom', {room: room})
    })
  }

  $scope.signIn = function() {
    Home.signIn($scope.userName)
  }

  $scope.addSearch = function() {
    var query = {title: $scope.data.search};
    console.log($scope.data.search)
    var suggestCallBack; // global var for autocomplete jsonp
    var request = {term: $scope.data.search};
    $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
      { 
        "hl":"en", // Language                  
        // "jsonp":"suggestCallBack", // jsonp callback function name
        "q":request.term, // query term
        "client":"youtube" // force youtube style response, i.e. jsonp
      })
    .then(function(data) {
      console.log(data[1])
      for (var i = 0; i < data[1].length; i++ ){
        query["response" + (i + 1)] = data[1][i][0];
      }
      console.log(query)
    Home.addSearch(query)
      .then(function() {
        $scope.data.query = "";
      }).catch(function (error) {
        console.log("Error in submitting Query", error);
        $scope.data.query = "";
      })
    })
  }
});
