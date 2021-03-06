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

  type UserAvatar {
    username: ID!
    avatarURL: String
  }

  type User @cacheControl(maxAge: 240, scope: PUBLIC) {
    id: ID!
    # Basic information
    email: String!
    username: String!
    avatarURL: String
    createdAt: String!

    # Populars
    likesRecived: Int!
    likedPost: [Post!]!
    comments: [Comment!]!
    followers: [UserAvatar]!
    following: [UserAvatar]!

    followersCount: Int!
    followingCount: Int!
  }

  type Auth {
    user: User!
    token: String!
  }

  type Query {
    # Post
    totalPost: Int!
    getPosts(offset: Int!, limit: Int): [Post!]!
    getPost(postId: ID, plainTitle: String): Post

    # User
    getUserInfo(username: ID!): User
    isFollowing(username: ID!): Boolean!
    userAvatars(usernames: [String!]!): [UserAvatar]!
  }

  type Mutation {
    # Post
    likePost(postId: ID!): Post!
    deletePost(postId: ID!): String!
    deleteComment(commentId: ID!): String!
    editPost(editPostInput: EditPostInput!): Post!
    createPost(title: String, body: String!): Post!
    createComment(postId: ID, plainTitle: ID, body: String!): Post!

    # Upload
    uploadPhoto(photo: Upload!): File!
    uploadAvatar(avatar: Upload!): File!

    # User
    toggleFollow(username: ID!): Boolean!
    register(registerInput: RegisterInput): Auth!
    login(username: String, password: String): Auth!

  }

  type Subscription {
    publishPost: Post
  }
`
