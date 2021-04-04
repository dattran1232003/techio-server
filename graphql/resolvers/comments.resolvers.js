const { Comment } = require('../../models')
const checkAuth = require('../../util/check-auth')
const { 
  findPost, formatPost 
} = require('../../util/mongooseQuery')

module.exports = {
  Mutation: {
    async createComment(_, { postId, plainTitle, body }, context) {
      const { username } = checkAuth(context)
      
      const newComment = new Comment({
        username, body
      })
      const [comment, post] = await Promise.all([
        newComment.save(), 
        findPost(postId, plainTitle)
      ])
      post.comments.push(comment)
      return formatPost(await post.save())
    }, // End of createComment function
    async deleteComment(_, { commentId }, context) {
      const { username } = checkAuth(context)
      
      const comment = await Comment.findById(commentId)
      if (comment?.username === username) {
        await comment.delete()
        return 'Comment removed'
      }
      return 'Comment not found or deleted'
    }, // End of delteComment function
  }
}

