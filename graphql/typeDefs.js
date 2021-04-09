const { gql }  = require('apollo-server')

module.exports = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    avatarURL: String
    confirmPassword: String!
  }

  input EditPostInput { 
    postId: ID!
    title: String
    body: String
    draft: Boolean
  }

  type Post {
    id: ID!
    username: ID!
    body: String!
    shortBody: String!
    title: String!
    likes: [Like!]!
    comments: [Comment!]!
    likeCount: Int!
    commentCount: Int!
    editHistories: [PostHistory!]!
    plainTitle: String!
    deletedAt: String
    createdAt: String!
    draft: Boolean!
  }
  
  type Like {
    username: String!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type PostHistory {
    body: String!
    editedAt: String!
  }

  type Total {
    model: String!
    count: Int!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    avatarURL: String!
    createdAt: String!
    likesRecived: Int!
    likedPost: [Post!]!
    comments: [Comment!]!
  }

  type Query {
    getTotal(model: String!): Total!
    getPosts(offset: Int!, limit: Int): [Post!]!
    getPost(postId: ID, plainTitle: String): Post
  }
  type Mutation {
    likePost(postId: ID!): Post!
    deletePost(postId: ID!): String!
    uploadPhoto(photo: Upload!): File!
    uploadAvatar(avatar: Upload!): File!
    deleteComment(commentId: ID!): String!
    register(registerInput: RegisterInput): User!
    editPost(editPostInput: EditPostInput!): Post!
    createPost(title: String, body: String!): Post!
    login(username: String, password: String): User!
    createComment(postId: ID, plainTitle: ID, body: String!): Post!
  }

  type Subscription {
    publishPost: Post
  }
`
