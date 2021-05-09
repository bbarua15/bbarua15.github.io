const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false); 
let uri = 'mongodb+srv://freeCodeCamp:QueensCollege@freecodecamp.0sfpo.mongodb.net/freeCodeCamp?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

let exerciseSessionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
})

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSessionSchema]
})

let Session = mongoose.model('Session', exerciseSessionSchema)
let User = mongoose.model('User', userSchema)

app.post("/api/users", bodyParser.urlencoded({ extended: false }), (req, res) => {
  let newUser = new User({ username: req.body.username })
  newUser.save((error, savedUser) => {
    if (!error) {
      let resObject = {}
      resObject["username"] = savedUser.username
      resObject["_id"] = savedUser.id
      res.json(resObject)
    }
  })
})

app.get("/api/users", (req, res) => {
  User.find({}, (error, arrayOfUsers) => {
    if (!error) {
      res.json(arrayOfUsers)
    }
  })
})


app.post("/api/users/:_id/exercises", bodyParser.urlencoded({ extended: false }), (req, res) => {

  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })

  if (newSession.date === "") {
    newSession.date = new Date().toISOString().substring(0, 10)
  }

  User.findByIdAndUpdate(
    req.params._id,
    { $push: { log: newSession } },
    { new: true },
    (error, updatedUser) => {
      if (!error) {
        let resObject = {}
        resObject["_id"] = updatedUser.id
        resObject["username"] = updatedUser.username
        resObject["date"] = new Date(newSession.date).toDateString()
        resObject["description"] = newSession.description
        resObject["duration"] = newSession.duration
        res.json(resObject)
      }
    }
  )

})


app.get("/api/users/:_id/logs", (req, res) => {

  User.findById(req.params._id, (error, result) => {
    if (!error) {
      let resObject = result

      if (req.query.from || req.query.to) {
        let fromDate = new Date(0)
        let toDate = new Date()

        if (req.query.from) {
          fromDate = new Date(req.query.from)
        }

        if (req.query.to) {
          toDate = new Date(req.query.to)
        }

        fromDate = fromDate.getTime()
        toDate = toDate.getTime()

        resObject.log = resObject.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime()

          return sessionDate >= fromDate && sessionDate <= toDate

        })

      }

      if (req.query.limit) {
        resObject.log = resObject.log.slice(0, req.query.limit)
      }

      resObject = resObject.toJSON()
      resObject["count"] = result.log.length
      res.json(resObject)
    }
  });
});