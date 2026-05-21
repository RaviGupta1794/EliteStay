const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]

});
UserSchema.plugin(passportLocalMongoose); // adds username and password fields, and some methods for authentication

module.exports = mongoose.model('User', UserSchema);