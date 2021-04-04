const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, ref: 'User' },
  body: { type: String, trim: true },
  createdAt: String
})

module.exports = model('Comment', commentSchema)
