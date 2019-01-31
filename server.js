var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('grpc');
var _ = require('lodash');
var async = require('async');
const fs = require('fs');
const speech = require('@google-cloud/speech');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var helloworld = protoDescriptor.helloworld;
const client = new speech.SpeechClient();

var languageCode = 'en-US'; //en-US get from socket ->

const STREAMING_LIMIT = 55000;
var request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCode,
    },
    interimResults: true
};
let recognizeStream = null;
let restartId;
/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doSayHello(call, callback) {
  console.log("saying hello");
  callback(null, {message: 'Hello! '+ call.request.name});
}

/**
 * @param {!Object} call
 */
function doSayRepeatHello(call) {
  console.log(call.request.filepath + " " + call.request.languagecode);
  var senders = [];
  function sender(filepath, languageCode) {
    return (callback) => {
      console.log("repeating hello");
      call.write({
        message: 'Audiofile path ' + filepath + ' language code is ' + languageCode
      });
      _.delay(callback, 500); // in ms
    };
  }
  for (var i = 0; i < 5; i++) {
    senders[i] = sender(call.request.filepath + i, call.request.languagecode);
  }
  async.series(senders, () => {
    call.end();
  });
}

/**
 * @return {!Object} gRPC server
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(helloworld.Greeter.service, {
    sayHello: doSayHello,
    sayRepeatHello: doSayRepeatHello
  });
  console.log("here i am, your server...");
  return server;
}

if (require.main === module) {
  var server = getServer();
  server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
  server.start();
}

exports.getServer = getServer;
