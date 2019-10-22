const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'required field']}, 
    lastName: {type: String, required: [true, 'required field']},
    email: {type: String, required: [true, 'required field']},
    password: String,
    lists: [{type: Schema.Types.ObjectId, ref: 'List'}],
    created: { type: Date, default: Date.now },
});

const User = new mongoose.model('User', userSchema);


module.exports = User;