require('dotenv').config();

let uri =
  "mongodb+srv://freeCodeCamp:QueensCollege@freecodecamp.0sfpo.mongodb.net/freeCodeCamp?retryWrites=true&w=majority";
let mongoose = require("mongoose");
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false); 

let peopleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model("Person", peopleSchema);

const createAndSavePerson = done => {
  let logan = new Person({
    name: "Logan",
    age: 22,
    favoriteFoods: ["Pizza"]
  });
  logan.save((error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

let arrayOfPeople = [
  { name: "Danny", age: 38, favoriteFoods: ["Pancake"] },
  { name: "Andy", age: 28, favoriteFoods: ["Hot Pot"] },
  { name: "Sean", age: 29, favoriteFoods: ["Bread"] }
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (error, people) => {
    if (error) {
      console.log(error);
    } else {
      done(null, people);
    }
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (error, arrayOfResults) => {
    if (error) {
      console.log(error);
    } else {
      done(null, arrayOfResults);
    }
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      done(null, data);
    }
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (error, result) => {
    if (error) return console.log(error);

    result.favoriteFoods.push(foodToAdd);

    result.save((error, updatedPerson) => {
      if (error) return console.log(error);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (error, updatedDocument) => {
      if (error) return console.log(error);
      done(null, updatedDocument);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (error, removeDocument) => {
    if (error) return console.log(error);
    done(null, removeDocument);
  });
};

const removeManyPeople = done => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (error, removeSuccess) => {
    if (error) return console.log(error);
    done(null, removeSuccess);
  });
};

const queryChain = function(done) {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: { $all: [foodToSearch] } })
    .sort({ name: "asc" })
    .limit(2)
    .select("-age")
    .exec((error, filtereResults) => {
      if (error) {
        console.log(error);
      } else {
        done(null, filtereResults);
      }
    });
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
