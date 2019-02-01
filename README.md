
# node-grpc-web

REQUIREMENTS:

docker
npm / NodeJS
protoc
envoy
http-server

`npm install -g http-server`

google-cloud API key / service JSON

# TO RUN EXAMPLE CODE:

open terminal

Clone Repo

`git clone git@github.com:blechdom/node-grpc-web.git`

change directory to repo

`cd node-grpc-web`

make sure Docker is running

build docker envoy proxy

`docker build -t node-grpc-web/envoy -f ./envoy.Dockerfile .`

run envoy proxy (add --network=host on non-mac machines --- removed for mac)

`docker run -d -p 8080:8080 node-grpc-web/envoy`

Install node packages

`npm install`

Build Webpack client (makes dist folder and main.js inside it)

`npm run build`

Start node server

`npm start`

open terminal tab

start http server at port 8081

`http-server -p 8081`

go to http://localhost:8081 in browser

# TO EDIT EXAMPLE CODE:

if you edit the cloud_speech_web.proto file, you will need to recompile it using protoc

Protoc will generate two files: cloud_speech_web_grpc_web_pb.js and cloud_speech_web_pb.js files

`protoc -I=. cloud_speech_web.proto \
--js_out=import_style=commonjs:. \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:.`

Since client.js uses these files, you will need to recompile with Webpack
`npm run build`

if you edit server.js, you will need to stop and start the node server:
ctl-c
`npm start`

refresh browser page / clear cache
