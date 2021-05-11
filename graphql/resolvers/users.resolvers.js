const { User } = require('@db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userQuery } = require('@queries')
const checkAuth = require('@util/check-auth')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('@util/validator')

const generateToken = (user) => {
  const token = jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, process.env.JWT_SECRET, { 
    expiresIn: (process.env.NODE_ENV === 'development' ? '120h' : '1h') 
  })
  return token
}

const formatUser = userData => ({
  user: {
    ...userData._doc,
    id: userData.id,
    createdAt: new Date(userData._doc.createdAt).toISOString()
  },
  token: generateToken(userData),
})

module.exports = {
  Query: {
  },
  Mutation: {
    async follow(_, thatPerson, context) {
      const me = checkAuth(context)
      const isFollowSuccess = await userQuery.follow(thatPerson, me)
      return isFollowSuccess
    },
    async register(_, { registerInput }) {
      const inputDataOrErrors = validateRegisterInput({
        ...registerInput,
        avatarURL: process.env.DEFAULT_AVATAR
      })
      if (!inputDataOrErrors.value) return new UserInputError('Input Errors', {
        errors: inputDataOrErrors
      })
      const { 
        email, 
        username, 
        password, 
        avatarURL
      } = registerInput

      // execute asynchronous tasks concurrently
      const findUser = User.findOne({ username })
      const hashingPassword = bcrypt.hash(password, 12)

      // Make sure user doesn't already exists
      if (await findUser) 
        return new UserInputError('Username is taken.', {
          errors: {
            username: ['This username already taken']
          }
        })

      // Create new user
      const newUser = new User({
        email,
        username,
        avatarURL,
        password: await hashingPassword,
        createdAt: new Date().toISOString()
      })
      const responseData = await newUser.save()

      return formatUser(responseData)
    }, // End of register function
    async login(_, inputLoginData) {
      const inputDataOrErrors = validateLoginInput(inputLoginData)
      if (!inputDataOrErrors.value) return new UserInputError('Input Errors', {
        errors: inputDataOrErrors
      })
      const { username, password } = inputLoginData
      
      // Check is user exists
      const user = await User.findOne({ username })
      if (!user) return new UserInputError('Wrong credential', {
        errors: { username: ['Không tìm thấy tài khoản.'] }
      })

      // Check is password correct
      const matchPassword = await bcrypt.compare(password, user.password)
      if (!matchPassword) return new UserInputError('Authenticate Failed', {
        errors: { password: ['Sai mật khẩu.'] }
      })
      
      return formatUser(user)
    }, // End of login function
  }
}
