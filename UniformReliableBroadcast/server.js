var net = require('net');
var fs = require('fs');
var variables = require('./variables');
var io = require('socket.io');
var _ = require('lodash');
var events = require('./constants').EVENTS;

var server = io.listen(8321);
var delivered, pending, correct, ack;

init();

function init() {
  ack = [];
  delivered = [];
  pending = [];
  correct = {};
}

server.on(events.CRASH, onCrash);

function onCrash(socket) {
  _.remove(correct, function(item) {
    return socket.id === item.id;
  });
} 

server.on(events.CONNECTION, function(socket) {
  correct.push(socket);

  socket.on(event.URB_BROADCAST, onUrbBroadcast);

  function onUrbBroadcast(message) {
    var data = {
      s: socket, 
      m: message
    };
    pending.push(data);
    socket.broadcast.emit(events.BEB_BROADCAST, data);
  }
});


