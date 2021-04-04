const totalResolvers = require('./total.resolvers')
const usersResolvers = require('./users.resolvers')
const postsResolvers = require('./posts.resolvers')
const uploadResolvers = require('./upload.resolvers')
const commentsResolver = require('./comments.resolvers')

module.exports = {
  Query: {
    ...uploadResolvers.Query, 
    ...postsResolvers.Query,
    ...totalResolvers.Query
  },
  Mutation: {
    ...uploadResolvers.Mutation, 
    ...postsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...commentsResolver.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
}
