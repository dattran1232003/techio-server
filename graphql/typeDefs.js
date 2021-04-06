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
    avatarURL: String!
    username: String!
    createdAt: String!
    likedPost: [Post!]!
    comments: [Comment!]!
    likesRecived: Int!
  }

  type Query {
    getPosts(offset: Int!, limit: Int): [Post!]!
    getTotal(model: String!): Total!
    getPost(postId: ID, plainTitle: String): Post
  }
  type Mutation {
    uploadPhoto(photo: Upload!): File!
    uploadAvatar(avatar: Upload!): File!
    register(registerInput: RegisterInput): User!
    login(username: String, password: String): User!
    createPost(title: String, body: String!): Post!
    editPost(editPostInput: EditPostInput!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID, plainTitle: ID, body: String!): Post!
    deleteComment(commentId: ID!): String!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    publishPost: Post
  }
`
