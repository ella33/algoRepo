var net = require('net');
var fs = require('fs');
var variables = require('./variables');
var io = require('socket.io');
var _ = require('lodash');
var events = require('./constants').EVENTS;

var server = io.listen(8321);
var value;

init();

function init() {
  ts = 0;
  val = null;
  readval = null;
  correct = [];
  writeset = [];
  reading = false;
}

server.on(events.CRASH, onCrash);

function onCrash(socket) {
  _.remove(correct, function(item) {
    return socket.id === item.id;
  });
} 

server.on(events.CONNECTION, function(socket) {
  correct.push(socket);

  socket.on(events.READ, onRead);
  //socket.on(events.WRITE, onWrite);  

  function onRead(val) {
    reading = true;
    readval = val;
    ts = (new Date()).getTime();
    server.sockets.emit(events.WRITE, {ts: ts, val: val});
  }

  //function onWrite(socket) {
  //  server.sockets.emit(events.WRITE, {ts: (new Date()).getTime(), val: val}); 
  //}
});