/*
* Flooding Consensus 
*/

var client = require('socket.io-client');
var io = require('socket.io')
var socket = client.connect('http://localhost:8321');
var events = require('./constants').EVENTS;

var variables = require('./variables');
var value, round, min, decided = false, values = [], round = 0, receivedFrom = [];

socket.on(events.VALUE, function(data) {
  value = data;
  receivedFrom[round] = [];
  receivedFrom[round].push(value);
  console.log('Received ', value);
});

socket.on(events.CONN_COMPLETED, function() {
  socket.emit(events.BROADCAST_PROPOSE, value);
});

socket.on(events.PROPOSE, function(value) {
  receivedFrom[round].push(value);
  console.log('Round #', (round+1));
  console.log('Propose value: ', value);
  console.log('Values: ', receivedFrom[round]);

  if (receivedFrom[round].length === variables.n) {
    min = Math.min.apply(null, receivedFrom[round]);
    socket.emit(events.BROADCAST_DECIDE, min);
  }
});

socket.on(events.DECIDE, function(value) {
  if (value === min) {
    console.log('Decided min: ', value);
    socket.close();
  } else {
    round += 1;
    receivedFrom[round] = [];
    socket.emit(events.BROADCAST_PROPOSE, value);
  }
});