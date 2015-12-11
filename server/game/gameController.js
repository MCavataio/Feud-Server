var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;


module.exports = {
  //possible refactoring to get Queries
  getCount: function(req, res, next) {
    console.log(req.param.id)
    helpers.getCount(function(err, response) {
      if (err) {
        console.log(err);
      } else {
        res.json(response);
      }
    })
  },

  getQueries: function(room) {
   helpers.getCount(function(err, response) {
      if (err) {
        console.log(err);
      } else {
        helpers.getNumbers(response, function(err, response) {
          if (err) {
            console.log(err) 
          } else {
            helpers.getQueries(response, function(err, queries) {
              if (err) {
                console.log(err);
              } else {
                // return response
                // setting index 3 to the socket room back to the client
                queries[3] = room.value
                console.log(room.value, "++++++++++++++++++++++++++++++");
                room.io.to(room.value).emit('startRound', queries)
                // res.json(queries);
              }
            });
          }
        })  
      }
    })
  },

  startRound: function(req, res, next) {
    console.log(req.params.id)
    helpers.getQuery(req.params.id, function (err, response) {
      if (err) {
        console.log(err);
      } else {
          req.io.sockets.to('req.paramas.id').emit('playRound', response)
        // res.json(response);
      }
    })
  },
}
