const mongoose = require('mongoose')
const bluebird = require('bluebird')
const cloudinary = require('cloudinary').v2
const { ApolloServer, PubSub } = require('apollo-server')

// config .env
require('dotenv').config()

const PORT = process.env.PORT || 5000

const pubsub = new PubSub()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

cloudinary.config((function() {
  const {
    CLOUD_NAME: cloud_name,
    CLOUD_API_KEY: api_key,
    CLOUD_API_SERECT: api_secret
  } = process.env

  return { cloud_name, api_key, api_secret }
})())

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: { 
    path: '/subscriptions',
    onConnect() {
      console.log('webSocket connected')
    },
    onDisconnect() {
      console.log('webSocket disconnected')
    }
  },
  context: ({ req }) => ({ req, pubsub })
})

mongoose.Promise = bluebird
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected')
    return server.listen({ port: PORT })
  })
  .then(({ url }) => { 
    console.log(`Server running at ${url}`) 
  })
  .catch(console.error)
