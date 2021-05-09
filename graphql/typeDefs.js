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
    user: User! 
    username: String!
    body: String!
    title: String!
    likes: [Like!]!
    likeCount: Int!
    draft: Boolean!
    deletedAt: String
    shortBody: String!
    commentCount: Int!
    createdAt: String!
    plainTitle: String!
    comments: [Comment!]!
    editHistories: [PostHistory!]!
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

  type User @cacheControl(maxAge: 240, scope: PUBLIC) {
    id: ID!
    email: String!
    username: String!
    avatarURL: String
    createdAt: String!
    likesRecived: Int!
    likedPost: [Post!]!
    comments: [Comment!]!
  }

  type Auth {
    user: User!
    token: String!
  }

  type Query {
    totalPost: Int!
    getUserInfo(username: ID!): User
    getPosts(offset: Int!, limit: Int): [Post!]!
    getPost(postId: ID, plainTitle: String): Post
  }

  type Mutation {
    likePost(postId: ID!): Post!
    deletePost(postId: ID!): String!
    uploadPhoto(photo: Upload!): File!
    uploadAvatar(avatar: Upload!): File!
    deleteComment(commentId: ID!): String!
    register(registerInput: RegisterInput): Auth!
    editPost(editPostInput: EditPostInput!): Post!
    createPost(title: String, body: String!): Post!
    login(username: String, password: String): Auth!
    createComment(postId: ID, plainTitle: ID, body: String!): Post!
  }

  type Subscription {
    publishPost: Post
  }
`
