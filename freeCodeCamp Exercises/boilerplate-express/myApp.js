var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 7)  Implement a Root-Level Request Logger Middleware
app.use((request, response, next) => {
 console.log(request.method + " " + request.path + " - " + request.ip);
 next();
});

// 11) Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({ extended: false}));


// 1) Meet the node console. 
console.log("Hello World")

// 2) Start a Working Express Server
// app.get("/", function(request, response) {
//   response.send('Hello Express');
// });
app.listen(3001, function() {
console.log('Listening on port 3000');
});

// 3) Serve an HTML file 
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
 });

// 4) Serve static assets 
app.use("/public", express.static(__dirname + "/public"));

// 5) Serve JSON on a specific route 
// let message = { message: "Hello json" };
// app.get("/json", (request, response) => {
//      response.json(message);
// });

// 6) Use the .env file 
const mySecret = process.env['MESSAGE_STYLE']
app.get("/json", (request, response) => {
	if (process.env.MESSAGE_STYLE === "uppercase") {
		response.json({"message" : "HELLO JSON"});
	} else {
		response.json({"message" : "Hello json"});
	}
});

// 8) Chain Middleware to Create a Time Server 
app.get('/now', (request, response, next) => {
  request.time = new Date().toString()  
  next();
}, (request, response) => {
  response.json({'time' : request.time})
});

// 9)  Get Route Parameter Input from the Client
app.get('/:word/echo', (request, response) => {
  response.json({echo : request.params.word})
});

// 10) Get Query Parameter Input from the Client
app.get('/name', (request, response) => {
  let string = request.query.first + ' ' + request.query.last
  response.json({ name:string });
});

// 12) Get Data from POST Requests
app.post('/name', (request, response) => {
  let string = request.body.first + ' ' + request.body.last;
  response.json({ name: string });
});

module.exports = app;

