const totalResolvers = require('./total.resolvers')
const usersResolvers = require('./users.resolvers')
const postsResolvers = require('./posts.resolvers')
const uploadResolvers = require('./upload.resolvers')
const commentsResolver = require('./comments.resolvers')

module.exports = {
  Query: {
    ...totalResolvers.Query,
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...uploadResolvers.Query, 
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...uploadResolvers.Mutation, 
    ...commentsResolver.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
}
