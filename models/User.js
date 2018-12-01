const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);

//NEVER EVER PUT PLAIN TEXT PASSWORDS IN YOUR DATABASE! (we'll be using bcrypt for that)