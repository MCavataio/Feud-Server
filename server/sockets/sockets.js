var GC = require('../game/gameController.js');
var rooms = {};

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log(socket.id, "connected")
    
    // once both users are on game page send data
    socket.on('initGame', function(data) {
      var room = {
        value: this.rooms[1],
        io: io
      }
      if (rooms[room]) {
        GC.getQueries(room)
        delete rooms[room]
        console.log('should be here once')
      } else {
        rooms[room] = true;
      }
    })

    // pairs random users to play against one another
    socket.on('changeRoom', function(data) {
    // data is the room number received from emit from queryController
    var nRoom = {
      value: data.room.data.room,
      io: io
    }
    // joins respective room
    socket.join(nRoom.value);
    // checks to see how many users are in current room;
    var room = io.sockets.adapter.rooms[nRoom.value];
    var length = Object.keys(room).length
    if (length === 2) {
      io.sockets.to(nRoom.value).emit('playRound', {room: nRoom.value})
      // setTimeout(function() {
      //   GC.getQueries(nRoom) 
      // }, 2000)
    }
    })
    // sends scores to other individuals playing in the same room
    // this.rooms consists of connection id and room number
    socket.on('updateScore', function(data) {
      socket.broadcast.to(this.rooms[1]).emit('updateScore', {score: data})
      // console.log(this.rooms, this.id);
    })
  })
}