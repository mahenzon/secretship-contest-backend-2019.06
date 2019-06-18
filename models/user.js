// Similar model can be found here:
// https://github.com/surik00/secretship-contest-bot-2019.06/blob/master/models/user.js

const { Schema, model } = require('mongoose')
const timestamps = require('mongoose-timestamp')
const uniqueValidator = require('mongoose-unique-validator')


const UserSchema = new Schema({
  user_id: Number,
  first_name: String,
  last_name: String,
  username: String,
  language_code: String,
  profile_photo_id: String,
  photo_url: String,  // that one which is returned by tg on login
})

UserSchema.plugin(timestamps)
UserSchema.plugin(uniqueValidator)

const User = model('User', UserSchema)
module.exports = User
