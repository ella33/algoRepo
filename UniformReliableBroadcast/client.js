var client = require('socket.io-client');
var io = require('socket.io')
var socket = client.connect('http://localhost:8321');
var events = require('./constants').EVENTS;
var fs = require('fs');
var variables = require('./variables');
var data;
var delivered, pending, correct, ack;

init();

function init() {
  ack = {};
  delivered = [];
  pending = [];
  correct = [];
}

socket.on(events.BEB_BROADCAST, onBebBroadcast);

function onBebBroadcast(data) {
  if (!ack[data.s.id]) {
    ack[data.s.id] = [];
  }
  ack[data.s.id].push(data);
  if (ack.length === variables.n) {
    
  }
  console.log('Got data ', data);
}
