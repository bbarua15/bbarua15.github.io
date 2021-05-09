var express = require('express');
var cors = require('cors');
var multer  = require('multer');
require('dotenv').config()
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});


let responseObject = {}
app.post('/api/fileanalyse', multer().single('upfile'), function (request, response) {
  response.json({
    'name': request.file.originalname,
    'type': request.file.mimetype,
    'size': request.file.size
  });
});