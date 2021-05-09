// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api", (request, response) => {
  var now = new Date();
  response.json({
    "unix" : now.getTime(), 
    "utc" : now.toGMTString()});
});

app.get("/api/:date_string", (request, response) => {
  let date_string = request.params.date_string;
  let date;
  if (/^\d+$/.test(date_string)) {
    date = new Date(parseInt(date_string));
  }
  else {
    date = new Date(date_string);
  }

  if (date.toString() !== 'Invalid Date') {
    response.json({
      "unix" : date.getTime(), 
      "utc" : date.toGMTString()});
  } else {
    response.json({error: "Invalid Date"});
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
