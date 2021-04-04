const R = require('ramda')
const { UserInputError } = require('apollo-server')

const { Post } = require('../../models')

const checkAuth = require('../../util/check-auth')
const { now, previewTextMarkdown } = require('../../util/reuseFunctions')
const { 
  findPost, formatPost, modTotal
} = require('../../util/mongooseQuery')

const onPublishing = ({ prevDraft=null, currentDraft=null }, cb) => {
  if (prevDraft === true && currentDraft === false) cb()
}

const changeTotal = modTotal.bind(null, 'Post')

module.exports = {
  Query: {
    async getPost(_, { postId, plainTitle }) {
      const post = await findPost(postId, plainTitle) 
      return formatPost(post)
    }, // End of getPost function
    async getPosts(_, { offset, limit=10 }) {
      const posts = await Post.find({ deletedAt: { $eq: null  } })
        .or([{ draft: false }, { draft: undefined }])
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)

      return posts.map(formatPost)
    }, // End of getPosts function
  },
  Mutation: {
    async createPost(_, { title, body }, context) {
      const { username } = checkAuth(context)
      const newPost = new Post({
        title: title || '',
        body, username, draft: true,
        shortBody: await previewTextMarkdown(body),
        createdAt: now()
      })
      const post = await newPost.save()

      if (!post._doc.draft) changeTotal(1).then(console.log).catch(console.error)
      return formatPost(post)
    }, // End of createPost function
    async deletePost(_, { postId }, context) {
      checkAuth(context)
      const post = await findPost(postId)
      post.deletedAt = now()
      await post.save()

      changeTotal(-1).then(console.log).catch(console.error)
      return 'Post deleted'
    }, // End of deletePost function
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context)
      const post = await findPost(postId)

      const userLiked = username => like => like.username === username
      const likeOrUnlike = R.ifElse(
        R.find(userLiked(username)),    // Condition
        R.reject(userLiked(username)),  // onTrue
        R.append({ username })          // onFalse
      )

      post.likes = likeOrUnlike(post.likes)
      return formatPost(await post.save())
    }, // End of likePost function
    async editPost(_, { editPostInput: { postId, title, body, draft }}, { pubsub }) {
      if (!draft && title?.trim() === '') return new UserInputError('Title null', {
        errors: {
          title: ['Title không được để trống']
        }
      })

      if (!draft && body?.trim() === '') return new UserInputError('Body null', {
        errors: {
          body: ['Nội dung không được để trống']
        }
      })

      const post = await findPost(postId)
      const shortBody = await previewTextMarkdown(body)
      const appendLimitArray = limit => elm => R.compose(
        R.append(elm), 
        R.takeLast(limit-1)
      )
      const oldPost = { 
        body: post.body,
        title: post.title,
        shortBody: shortBody,
        draft: post.draft,
        editedAt: now()
      }
      const appendToHistories = R.uncurryN(2, appendLimitArray(5))

      post.title=title
      post.body = body
      post.shortBody = shortBody
      // change draft to false once only, and cannot change to true again
      post.draft= ( post.draft 
        ? draft // if post doesn't yet public, change "is draft" like what user want
        : false // otherwise if post is published, set "is draft" always to false
      )

      post.editHistories = appendToHistories(oldPost, post.editHistories)
      const savedPost = formatPost(await post.save())

      onPublishing(
        { prevDraft: oldPost.draft, currentDraft: draft }, 
        () => { 
          changeTotal(1).then(console.log).catch(console.error)
          pubsub.publish('PUBLISH_POST', { publishPost: { ...savedPost } })

        }      
      )
      return savedPost
    }, // End of editPost function
  }, // End of Mutation
  Subscription: {
    publishPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('PUBLISH_POST')
    }
  }, // End of Subscription
}
