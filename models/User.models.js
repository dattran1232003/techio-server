const mongoose = require('mongoose')
const { Schema, model } = mongoose


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
    default: process.env.DEFAULT_AVATAR
  },
  likedPost: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likesRecived: Number,
  createdAt: String 
})
module.exports = model('User', userSchema)
