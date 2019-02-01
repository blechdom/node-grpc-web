/**
 * @fileoverview gRPC-Web generated client stub for cloud_speech_web
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.cloud_speech_web = require('./cloud_speech_web_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.cloud_speech_web.SpeechClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.cloud_speech_web.SpeechPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!proto.cloud_speech_web.SpeechClient} The delegate callback based client
   */
  this.delegateClient_ = new proto.cloud_speech_web.SpeechClient(
      hostname, credentials, options);

};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.cloud_speech_web.LanguageRequest,
 *   !proto.cloud_speech_web.LanguageResponse>}
 */
const methodInfo_Speech_SetLanguageCode = new grpc.web.AbstractClientBase.MethodInfo(
  proto.cloud_speech_web.LanguageResponse,
  /** @param {!proto.cloud_speech_web.LanguageRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.cloud_speech_web.LanguageResponse.deserializeBinary
);


/**
 * @param {!proto.cloud_speech_web.LanguageRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.cloud_speech_web.LanguageResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.cloud_speech_web.LanguageResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechClient.prototype.setLanguageCode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/cloud_speech_web.Speech/SetLanguageCode',
      request,
      metadata,
      methodInfo_Speech_SetLanguageCode,
      callback);
};


/**
 * @param {!proto.cloud_speech_web.LanguageRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.cloud_speech_web.LanguageResponse>}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechPromiseClient.prototype.setLanguageCode =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.setLanguageCode(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.cloud_speech_web.AudioStreamRequest,
 *   !proto.cloud_speech_web.AudioStreamResponse>}
 */
const methodInfo_Speech_TranscribeAudioStream = new grpc.web.AbstractClientBase.MethodInfo(
  proto.cloud_speech_web.AudioStreamResponse,
  /** @param {!proto.cloud_speech_web.AudioStreamRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.cloud_speech_web.AudioStreamResponse.deserializeBinary
);


/**
 * @param {!proto.cloud_speech_web.AudioStreamRequest} request The request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.cloud_speech_web.AudioStreamResponse>}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechClient.prototype.transcribeAudioStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/cloud_speech_web.Speech/TranscribeAudioStream',
      request,
      metadata,
      methodInfo_Speech_TranscribeAudioStream);
};


/**
 * @param {!proto.cloud_speech_web.AudioStreamRequest} request The request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.cloud_speech_web.AudioStreamResponse>}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechPromiseClient.prototype.transcribeAudioStream =
    function(request, metadata) {
  return this.delegateClient_.client_.serverStreaming(this.delegateClient_.hostname_ +
      '/cloud_speech_web.Speech/TranscribeAudioStream',
      request,
      metadata,
      methodInfo_Speech_TranscribeAudioStream);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.cloud_speech_web.StopStreamRequest,
 *   !proto.cloud_speech_web.StopStreamResponse>}
 */
const methodInfo_Speech_StopAudioStream = new grpc.web.AbstractClientBase.MethodInfo(
  proto.cloud_speech_web.StopStreamResponse,
  /** @param {!proto.cloud_speech_web.StopStreamRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.cloud_speech_web.StopStreamResponse.deserializeBinary
);


/**
 * @param {!proto.cloud_speech_web.StopStreamRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.cloud_speech_web.StopStreamResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.cloud_speech_web.StopStreamResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechClient.prototype.stopAudioStream =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/cloud_speech_web.Speech/StopAudioStream',
      request,
      metadata,
      methodInfo_Speech_StopAudioStream,
      callback);
};


/**
 * @param {!proto.cloud_speech_web.StopStreamRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.cloud_speech_web.StopStreamResponse>}
 *     The XHR Node Readable Stream
 */
proto.cloud_speech_web.SpeechPromiseClient.prototype.stopAudioStream =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.stopAudioStream(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


module.exports = proto.cloud_speech_web;

