const { Post } = require('../../models')

module.exports = {
  Query: {
    async totalPost() {
      const publishingPostCount = await Post
        .countDocuments({ deletedAt: null, draft: false  })

      return publishingPostCount
    }
  }
}
