const mongoose = require('mongoose')

const { Schema, model } = mongoose
const postSchema = new Schema({
  body: { type: String, required: true, trim: true },
  shortBody: { type: String, trim: true },
  title: {type: String, default: '', trim: true },
  username: {
    type: String,
    trim: true,
    required: true
  },
  draft: { type: Boolean, default: true },
  plainTitle: { trim: true, type: String, default: '' },
  likes: [{ username: String }],
  comments: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  editHistories: {
    type: [{ body: String, editedAt: String }],
    default: []
  },
  deletedAt: {
    type: String,
    default: null
  },
  createdAt: String
})
const { normalizeString } = require('../util/reuseFunctions')

postSchema.post('save', async function() {
  const { _id, title } = this
  const PostModel = Model()

  if (title.trim() === "") {
    this.plainTitle = _id
  } else {
    const formatedTitle = normalizeString(title, { lowercase: true })
    const postHasPlainTitle = await PostModel.findOne({ 
      _id: { $not: { $eq: _id } },
      plainTitle: formatedTitle
    })

    this.plainTitle = formatedTitle
    if(postHasPlainTitle) {
      this.plainTitle = (postHasPlainTitle?._id.toString() !== _id.toString())
        ? `${formatedTitle} ${_id}` 
        : formatedTitle
    }
  }

  await PostModel.updateOne({ _id }, { plainTitle: this.plainTitle })
})


const PostModel = model('Post', postSchema)
module.exports = PostModel

function Model () { return PostModel }
