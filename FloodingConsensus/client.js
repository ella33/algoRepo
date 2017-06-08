var client = require('socket.io-client');
var io = require('socket.io')
var socket = client.connect('http://localhost:8321');
var events = require('./constants').EVENTS;

var variables = require('./variables');
var value, round, min, decided = false, values = [];

socket.on(events.VALUE, function(data) {
  value = data;
  values.push(value);
  console.log('Received ', value);
});

socket.on(events.CONN_COMPLETED, function() {
  socket.emit(events.BROADCAST_PROPOSE, value);
});

socket.on(events.PROPOSE, function(value) {
  console.log('Propose value: ', value);
  values.push(value);

  if (values.length === variables.n) {
    min = Math.min.apply(null, values);
    socket.emit(events.BROADCAST_DECIDE, min);
  }
});

socket.on(events.DECIDE, function(value) {
  if (value === min) {
    console.log('Decided min: ', value);
    socket.close();
  }
});