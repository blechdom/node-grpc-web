var PROTO_PATH = __dirname + '/cloud_speech_web.proto';

const io = require("socket.io");
//var ss = require('socket.io-stream');
const SocketServer = io.listen(8082);

var grpc = require('grpc');
var _ = require('lodash');
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
var cloud_speech_web = protoDescriptor.cloud_speech_web;
const client = new speech.SpeechClient();

var languageCode = 'en-US';

const STREAMING_LIMIT = 55000;
let recognizeStream = null;
let restartTimeoutId;
var audioStreamCall = null;

function doSetLanguageCode(call, callback) {
  languageCode = call.request.languagecode;
  callback(null, {message: 'Language code successfully set to '+ languageCode});
}

SocketServer.on("connection", function(socket) {

  socket.on('binaryStream', function(data) {
    if(recognizeStream!=null) {
      recognizeStream.write(data);
    }
  });
});

function doTranscribeAudioStream(call) {
  audioStreamCall = call;
  startStreaming();
}

function startStreaming() {

  var request = {
      config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: languageCode,
      },
      interimResults: true
  };

  recognizeStream = client
    .streamingRecognize(request)
    .on('error', (error) => {
      console.error;
    })
    .on('data', (data) => {
      if (data.results[0] && data.results[0].alternatives[0]){
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(data.results[0].alternatives[0].transcript);
        if (data.results[0].isFinal) process.stdout.write('\n');
        audioStreamCall.write({
          transcript: data.results[0].alternatives[0].transcript,
          isfinal: data.results[0].isFinal
        });
      }
    });
    audioStreamCall.write({
      isstatus: "Streaming server successfully started"
    });
    restartTimeoutId = setTimeout(restartStreaming, STREAMING_LIMIT);
}

function doStopAudioStream(call, callback) {
  clearTimeout(restartTimeoutId);
  audioStreamCall.end();
  stopStreaming();
  callback(null, {message: 'Server has successfully stopped streaming'});
}

function stopStreaming(){
  recognizeStream = null;
}

function restartStreaming(){
  stopStreaming();
  startStreaming();
}

function getServer() {
  var server = new grpc.Server();
  server.addService(cloud_speech_web.Speech.service, {
    setLanguageCode: doSetLanguageCode,
    transcribeAudioStream: doTranscribeAudioStream,
    stopAudioStream: doStopAudioStream
  });
  console.log("Server Started");
  return server;
}

if (require.main === module) {
  var server = getServer();
  server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
  server.start();
}

exports.getServer = getServer;
