require('dotenv').config();
const mongoose = require('mongoose');
//=======================DB============================//
mongoose.connect(process.env.MONGO_URI, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
});

const db = mongoose.connection;

//Set up event for db to print connection 

db.once('open', ()=> {
    console.log(`Connect to MongoDB ${db.host}:${db.port}`);
})

db.on(`error`, (error)=> {
    console.log(`Database error`, error);
});

//import all of your models

//=====================MODELS===========================//

const User = require('./User');
const Book = require('./Book');

//export all the models from this file

module.exports = {
    User,
    Book,
}
