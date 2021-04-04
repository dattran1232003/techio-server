const mongoose = require('mongoose')
const { Schema, model } = mongoose

const countSchema = new Schema({
  model: { type: String, unique: true },
  count: Number
})

module.exports = model('Count', countSchema)
