angular.module('feud.services', [])

.factory('Query', function ($http, $location, $window) {
  var addSearch = function(search) {
    console.log(search ,"++++++")

    return $http({
      method: 'POST',
      url: 'api/queries',
      data: {
        query: search
      }
    })
  }
  var createRoom = function() {
    return $http({
      method: 'GET',
      url: 'api/queries/room',
    }).then(function(response) {
      return response;
    })
  }
  return {
    addSearch: addSearch,
    createRoom: createRoom
  }
 })
.factory('Game', function($http, $window, $location) {
  var getCount = function() {
    return $http({
      method: "GET",
      url: 'api/game/count'
    }).then (function (response) {
      return response;
    });
  }
  var startRound = function(queryId) {
    var url = 'api/game/query/' + queryId
    return $http({
      method: "GET",
      url: url
    }).then(function (response) {
      return response;
    })
  }
  return {
    getCount: getCount,
    startRound: startRound
  }
})
  // brian ford socket wrapper implementation
.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000/', {
    'sync disconnect on unload': true });
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
})