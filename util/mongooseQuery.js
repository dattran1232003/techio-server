const CacheService = require('@util/cacheService')
const { ForbiddenError } = require('apollo-server')
const { User, Post, Comment, Count } = require('../models')

// initialize cache service
const cache = new CacheService(60 * 15) // cache for 15 minutes

const { previewTextMarkdown } = require('../util/reuseFunctions')

const findPost = async function findPost(postId, plainTitleURL='') {
  const plainTitle = plainTitleURL.replace(/-/g, ' ').trim().toLowerCase()

  if (!postId?.trim() === '' || !plainTitleURL?.trim() === '')
    throw new Error('must have one of 2 field')

  const postCanDisplayFilter = { deletedAt: { $eq: null } }
  const findPostQuery = plainTitle 
    ? Post.findOne({ plainTitle }).where(postCanDisplayFilter)
    : Post.findById(postId).where(postCanDisplayFilter) 

  const post = await findPostQuery
  if (!post) throw new ForbiddenError('Post đã bị xóa hoặc chưa được tạo.')
  return post
}
const findPostPublishedOnly = async (postId, plainTitleURL='') => {
  if (!postId?.trim() === '' || !plainTitleURL?.trim() === '')
    throw new Error('must have one of 2 field')
  const postCanDisplayFilter = { draft: false, deletedAt: null }
  const findPostQuery = plainTitleURL 
    ? Post.findOne({ plainTitle: plainTitleURL }).where(postCanDisplayFilter)
    : Post.findById(postId).where(postCanDisplayFilter) 

  const post = await findPostQuery
  if (!post) throw new ForbiddenError('Post đã bị xóa hoặc chưa được tạo.')
  return post
}
const formatPost = post => ({ 
  ...post._doc, id: post.id,
  body: post._doc.body,
  commentCount: post.comments.length,
  user: findUser.bind(this, post._doc.username),
  comments: comments.bind(this, post.comments),
  plainTitle: post?.plainTitle?.replace(/ /g, '-') || null,
  shortBody: post._doc.shortBody || previewTextMarkdown.bind(this, post._doc.body),
  likeCount: post.likes.length
})

const comments = commentIds =>
  Comment.find({ _id: { $in: commentIds }})
    .then(res => res)
    .catch(debug([]))

const debug = returnValue => error => { 
  console.error.bind(this, 'Error:', error) 
  return returnValue
}

const modTotal = async (model, addition) => {
  const total = await Count.findOne({ model })
  if (total) {
    total.count += (typeof addition === 'number' ? addition : 0)
    return total.save()
  } else {
    const newTotal = new Count({
      model,
      count: addition > 0 ? addition : 0
    })
    return newTotal.save()
  }
}

const findUser = async username => {
  const user = await cache.get(username, async () => User.findOne({ username }))
  return user
}

module.exports = {
  findPost,
  findPostPublishedOnly,
  formatPost,
  comments,
  modTotal
}
