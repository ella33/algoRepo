var client = require('socket.io-client');
var io = require('socket.io')
var socket = client.connect('http://localhost:8321');
var events = require('./constants').EVENTS;
var fs = require('fs');
var variables = require('./variables');
var data;
var rr = 'data/rr.json';
var ra = 'data/ra.json';
var FileService = require('fileService').FileService;

socket.on(events.WRITE, onWrite);

function read() {
  var rrData = FileService.read(rr);
  if (data && rrData.ts > data.ts) {
    data = rrData;
    socket.emit(events.READ, data);
  } else {
    data = rrData;
  }
}

function onWrite(data) {
  FileService.write(rr, data);
}