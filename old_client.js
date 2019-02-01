window.onload = function(){
  var recordingStatus = false;
  var startStreamingButton = document.getElementById('start-streaming');
  var currentResult = document.getElementById('currentResult');
  var finalResult = document.getElementById('finalResult');
  var languageCode = document.getElementById('languageCodeSelect');
  var statusMessages = document.getElementById('statusMessages');
  var protoMessages = document.getElementById('protoMessages');
  var fileInput = document.getElementById('file-input');
  var uploadFileButton = document.getElementById('upload-file');
  var langCode = "en-US";


  var socket = io("http://localhost:8082");
  socket.on("welcome", (message) => {
      console.log(message);
  })


  fileInput.addEventListener("change", function() {
      console.log("Language selected: " + fileInput.files[0].name);
      //langCode = languageCode.value;
      //socket.emit('languageCode', languageCode.value);
  });

  const { FileRequest,
          FileResponse,
          LanguageRequest,
          LanguageResponse,
          AudioStreamRequest,
          AudioStreamResponse,
        } = require('./cloud_speech_web_pb.js');

  const {SpeechClient} = require('./cloud_speech_web_grpc_web_pb.js');

  var client = new SpeechClient('http://' + window.location.hostname + ':8080', null, null);

  languageCode.addEventListener("change", function() {

      langCode = languageCode.value;

      var request = new LanguageRequest();

      request.setLanguagecode(langCode);

      client.setLanguageCode(request, {}, (err, response) => {
        console.log(response.getMessage());
        protoMessages.append(document.createElement("br"), response.getMessage());
      });

  });

  uploadFileButton.onclick = function() {

    statusMessages.innerHTML = "Transcribing...";

    var request = new FileRequest();

    request.setFilepath('./resources/Brooklyn.flac');

    var stream = client.transcribeFile(request, {});

    stream.on('data', (response) => {
      console.log(response.getMessage());
      protoMessages.append(document.createElement("br"), response.getMessage());
    });

  }

  startStreamingButton.onclick = function() {
    if(!recordingStatus){
      console.log("start streaming");
      startStreaming();
    }
    else {
      console.log("stop streaming");
      stopStreaming();
    }
  }

  let bufferSize = 2048,
  	AudioContext,
  	context,
  	processor,
  	input,
  	globalStream;

  let	streamStreaming = false;

  const constraints = {
  	audio: true,
  	video: false
  };

  function initRecording() {
  	streamStreaming = true;
    console.log("init recording");
    var request = new AudioStreamRequest();

    request.setStart(true);

    var stream = client.transcribeAudioStream(request, {});

    stream.on('data', (response) => {
      console.log("transcript: " + response.getTranscript() + " isFinal? " + response.getIsfinal());
      currentResult.innerHTML = response.getTranscript();
      if (response.getIsfinal()){
        finalResult.append(document.createElement("br"), response.getTranscript());
      }
    });

  	AudioContext = window.AudioContext || window.webkitAudioContext;
  	context = new AudioContext();
  	processor = context.createScriptProcessor(bufferSize, 1, 1);
  	processor.connect(context.destination);
  	context.resume();

  	var handleSuccess = function (stream) {
  		globalStream = stream;
  		input = context.createMediaStreamSource(stream);
  		input.connect(processor);

  		processor.onaudioprocess = function (e) {
  			microphoneProcess(e);
  		};
  	};

  	navigator.mediaDevices.getUserMedia(constraints)
  		.then(handleSuccess);

  }

  function microphoneProcess(e) {
  	var left = e.inputBuffer.getChannelData(0);
  	var left16 = downsampleBuffer(left, 44100, 16000);
  	socket.emit('binaryStream', left16);
  }

  function startStreaming() {
    recordingStatus = true;
    microphoneIcon.setAttribute("class", "icon-flash");
    microphoneIcon.style.color = "LimeGreen";
    currentResult.innerHTML = "";
    finalResult.innerHTML = "";
    statusMessages.innerHTML = "Listening...";
  	initRecording();
  }

  function stopStreaming() {
  	streamStreaming = false;
    recordingStatus = false;
    microphoneIcon.removeAttribute("class", "icon-flash");
    microphoneIcon.style.color = "DodgerBlue";
    statusMessages.innerHTML = "Select an audio file or click on microphone to begin...";

  	let track = globalStream.getTracks()[0];
  	track.stop();
    if(input){
      input.disconnect(processor);
    	processor.disconnect(context.destination);
    	context.close().then(function () {
    		input = null;
    		processor = null;
    		context = null;
    		AudioContext = null;
    	});
    }
    var request = new AudioStreamRequest();

    request.setStart(false);

    client.stopStream(request, {}, (err, response) => {
      console.log(response.getMessage());
    });
  }

  window.onbeforeunload = function () {
  	if (streamStreaming) {
      stopStreaming();
    }
  };

  var downsampleBuffer = function (buffer, sampleRate, outSampleRate) {
      if (outSampleRate == sampleRate) {
          return buffer;
      }
      if (outSampleRate > sampleRate) {
          throw "downsampling rate show be smaller than original sample rate";
      }
      var sampleRateRatio = sampleRate / outSampleRate;
      var newLength = Math.round(buffer.length / sampleRateRatio);
      var result = new Int16Array(newLength);
      var offsetResult = 0;
      var offsetBuffer = 0;
      while (offsetResult < result.length) {
          var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
          var accum = 0, count = 0;
          for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
              accum += buffer[i];
              count++;
          }

          result[offsetResult] = Math.min(1, accum / count)*0x7FFF;
          offsetResult++;
          offsetBuffer = nextOffsetBuffer;
      }
      return result.buffer;
  }

};
