window.onload = function(){
  var recordingStatus = false;
  var startStreamingButton = document.getElementById('start-streaming');
  var currentResult = document.getElementById('currentResult');
  var finalResult = document.getElementById('finalResult');
  var languageCode = document.getElementById('languageCodeSelect');
  var statusMessages = document.getElementById('statusMessages');
  var protoMessages = document.getElementById('protoMessages');
  var langCode = "en-US";


  const {HelloRequest, RepeatHelloRequest,
         HelloReply} = require('./helloworld_pb.js');
  const {GreeterClient} = require('./helloworld_grpc_web_pb.js');

  var client = new GreeterClient('http://' + window.location.hostname + ':8080',
                                 null, null);

  // simple unary call
  var request = new HelloRequest();
  request.setName('World');

  client.sayHello(request, {}, (err, response) => {
    console.log(response.getMessage());
    protoMessages.append(document.createElement("br"), response.getMessage());
  });


  languageCode.addEventListener("change", function() {
      console.log("Language selected: " + languageCode.value);
      langCode = languageCode.value;
      //socket.emit('languageCode', languageCode.value);
  });

  startStreamingButton.onclick = function() {
    if(!recordingStatus){
      console.log("start streaming");
      startStreaming();
      // server streaming call
      var streamRequest = new RepeatHelloRequest();
      streamRequest.setFilepath('./resources/Brooklyn.flac');
      streamRequest.setLanguagecode(langCode);

      var stream = client.sayRepeatHello(streamRequest, {});
      stream.on('data', (response) => {
        console.log(response.getMessage());
        protoMessages.append(document.createElement("br"), response.getMessage());
      });
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
  	//socket.emit('startStream', '');
  	streamStreaming = true;
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
  	var left16 = downsampleBuffer(left, 44100, 16000)
  	//socket.emit('binaryStream', left16);
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

    //socket.emit('stopStream', '');
  }

  //socket.on('transcription', function (data) {
  	//console.log(data);
  //  currentResult.innerHTML = data.alternatives[0].transcript;
  //  if (data.isFinal){
  //    finalResult.append(document.createElement("br"), data.alternatives[0].transcript);
  //  }
  //});

  //socket.on('APIError', function(data) {
  //  console.log(data);
  //  statusMessages.innerHTML = data;
    //stopStreaming();
  //});

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
