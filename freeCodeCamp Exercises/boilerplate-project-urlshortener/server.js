require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
let mongodb = require("mongodb");
let mongoose = require("mongoose");
let bodyParser = require('body-parser');
mongoose.set('useFindAndModify', false); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let uri = 'mongodb+srv://freeCodeCamp:QueensCollege@freecodecamp.0sfpo.mongodb.net/freeCodeCamp?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  url : {type: String, required: true},
  shortUrl: Number
})

let Url = mongoose.model("Url", urlSchema);

app.post("/api/shorturl", bodyParser.urlencoded({extended: false}), function (request, response) {

let responseObject = {};

let urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

if(!urlRegex.test(request.body.url)) {
  response.json({error: "Invalid URL"});
  return;
}

 responseObject['original_url'] = request.body.url;

let inputShort = 1;

  Url.findOne({})
    .sort({shortUrl: "desc"}) 
    .exec((error, result) => {
      if (!error && result != undefined) inputShort = result.shortUrl + 1;

      if(!error){
          Url.findOneAndUpdate(
            {url: request.body.url},
            {url: request.body.url, shortUrl: inputShort},
            {new: true, upsert: true},
            (error, savedUrl) => {
                if (!error){
                  responseObject["short_url"] = savedUrl.shortUrl;
                  response.json(responseObject);
            }
          }
        );
      }
  });
});

app.get("/api/shorturl/:input", function(request, response) {
  
  let input = request.params.input;
  
  Url.findOne({shortUrl: input}, function(error, result) {
    if(!error && result != undefined) {
      response.redirect(result.url);
    } else {
      response.json({error: 'URL not found'});
    }
  });
});