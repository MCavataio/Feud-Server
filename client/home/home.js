angular.module("feud.home", [])

.controller("HomeController", function($rootScope, $scope, $window, $location, Home, socket) {
  $scope.data = {};
  $scope.socket = 0;
  var room;

  ///////////////////////////////////////////
  /////// Login
  ///////////////////////////////////////////

  $scope.login = function() {
    Home.login($scope.data.user).then(function(user) {

    })
  }

  ////////////////////////////////////////////
  ////// Socket
  ////////////////////////////////////////////

  $scope.createRoom = function() {
    Home.createRoom()
    .then(function(room) {
      // console.log('in create room', room)
      socket.emit('changeRoom', {room: room})
    })
  }

  socket.on('playRound', function(response) {
    $location.path('/game');
    $scope.room(response);
  }); 
  ////////////////////////////////////////////
  //// add search feature
  ////////////////////////////////////////////

  $scope.addQuery = function() {
    var query = {title: $scope.data.search};
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
        console.log(data.title)
        for (var i = 0; i < data[1].length; i++ ){
          var split = data[1][i][0].split(query.title + " ")
          console.log(split)
          if (split.length > 1) {
            query["response" + (i + 1)] = split[1];
          } else {
            query['response' + (i + 1)] = split[0];
          }
        } 
      console.log(query)
      Home.addQuery(query)
        .then(function() {
          $scope.data.query = "";
        }).catch(function (error) {
          console.log("Error in submitting Query", error);
          $scope.data.query = "";
        })
      })
    }
  });
