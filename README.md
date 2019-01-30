# node-grpc-web
stop / start docker desktop		
use protoc to compile proto file	protoc -I=. helloworld.proto \
	--js_out=import_style=commonjs:. \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
install node dependencies	npm install
delete previous webpack main.js build	npm run build	was: rm -rf ./dist
use webpack to compile client.js	(included in above)	was: npx webpack client.js
Run the NodeJS gRPC Service. This listens at port :9090	npm start	was: node server.js

open new terminal		

Run the Envoy proxy. The envoy.yaml file configures Envoy to listen to browser requests at port :8080, and forward them to port :9090 (see above).	docker build -t helloworld/envoy -f ./envoy.Dockerfile .	made simple edit to envoy.yaml for mac compatibility
	docker run -d -p 8080:8080 helloworld/envoy	add --network=host on non-mac machines
Run the simple Web Server. This hosts the static file index.html and dist/main.js we generated earlier --> using python:	python -m SimpleHTTPServer 8081
OR node:	npm install http-server
	"http-server -p 8081 --cors
"
go to URL in browser->	http://127.0.0.1:8081/	
