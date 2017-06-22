/*
* Uniform Reliable Broadcast
*/

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
  ack = [];
}

socket.on(events.BEB_BROADCAST, onBebBroadcast);

function onBebBroadcast(data) {
  ack.push(data);
  if (ack.length === variables.n) {
    socket.emit(events.DELIVER);
  }
}

setTimeout(function(){
  var message = new Date().toString();
  console.log('message ', message);
  socket.emit(events.URB_BROADCAST, message);
}, 500);