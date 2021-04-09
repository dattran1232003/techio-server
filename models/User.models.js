const mongoose = require('mongoose')
const { Schema, model } = mongoose

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    trim: true,
    type: String,
    unique: true,
    required: true,
  },
  avatarURL: {
    trim: true,
    type: String,
    required: true,
    validate: urlRegex,
    default: process.env.DEFAULT_AVATAR
  },
  likedPost: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likesRecived: Number,
  createdAt: String 
})
module.exports = model('User', userSchema)
