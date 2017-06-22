/*
* Flooding Consensus 
*/

var net = require('net');
var variables = require('./variables');
var io = require('socket.io');
var events = require('./constants').EVENTS;

var server = io.listen(8321);
var value;

function generateRandomValue() {
  return Math.floor(Math.random() * (variables.max - variables.min + 1) + variables.min);
}

server.on(events.CONNECTION, function(socket) {
  console.log('#Clients :', server.engine.clientsCount);
  value = generateRandomValue();
  socket.emit(events.VALUE, value);

  if (server.engine.clientsCount === variables.n) {
    server.sockets.emit(events.CONN_COMPLETED); 
  }

  socket.on(events.BROADCAST_PROPOSE, function(value) {
    socket.broadcast.emit(events.PROPOSE, value);
  });

  socket.on(events.BROADCAST_DECIDE, function(value) {
    socket.broadcast.emit(events.DECIDE, value);
  });
});