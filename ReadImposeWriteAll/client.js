/*
* Read-Impose Write-All
*/

var client = require('socket.io-client');
var io = require('socket.io')
var socket = client.connect('http://localhost:8321');
var events = require('./constants').EVENTS;
var fs = require('fs');
var variables = require('./variables');
var data;
var ra = 'data/ra.json';
var FileService = require('./fileService');

socket.on(events.WRITE, onWrite);

function generateRandomValue() {
  return Math.floor(Math.random() * (variables.max - variables.min + 1) + variables.min);
}

function read(data) {
  var raData = FileService.read(ra);
  console.log('File data', raData);
  if (data && (raData.ts < data.ts)) {
    socket.emit(events.READ, data); 
  }
}

function onWrite(data) {
  console.log('### Writing: ', data);
  FileService.write(ra, data);
}

if (process.argv[2]) {
  setInterval(function() {
    read({ts: (new Date()).getTime(), val: generateRandomValue()});
  }, process.argv[2] * 1000);
} else {
  console.log('Usage: node client.js  <interval_seconds>');
  socket.close();
}