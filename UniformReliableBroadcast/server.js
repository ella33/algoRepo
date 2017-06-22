/*
* Uniform Reliable Broadcast
*/

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
  correct = [];
}

server.on(events.CRASH, onCrash);

function onCrash(socket) {
  _.remove(correct, function(item) {
    return socket.id === item.id;
  });
} 

server.on(events.CONNECTION, function(socket) {
  correct.push(socket);

  socket.on(events.URB_BROADCAST, onUrbBroadcast);
  socket.on(events.DELIVER, onDeliver);

  function onUrbBroadcast(message) {
    var data = {
      id: socket.id, 
      m: message
    };
    pending.push(data);
    server.sockets.emit(events.BEB_BROADCAST, data);
  }

  function onDeliver() {
    if (pending.length === correct.length) {
      console.log('### DELIVERING ###');
      pending.forEach(function(item){
        console.log(item.m);
      });
    }
  }
});