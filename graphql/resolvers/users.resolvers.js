const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { User } = require('../../models')
const { validateRegisterInput, validateLoginInput } = require('../../util/validator')

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

module.exports = {
  Mutation: {
    async register(_, { registerInput }) {
      const inputDataOrErrors = validateRegisterInput(registerInput)
      if (!inputDataOrErrors.value) return new UserInputError('Input Errors', {
        errors: inputDataOrErrors
      })
      const { 
        username, 
        email, 
        password, 
        avatarURL 
      } = registerInput

      const hashingPassword = bcrypt.hash(password, 12)
      // Make sure user doesn't already exists
      if (await User.findOne({username})) 
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
      const res = await newUser.save()

      return {
        ...res._doc,
        id: res.id,
        token: generateToken(res),
        createdAt: new Date(res._doc.createdAt).toISOString()
      }
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
      
      return {
        ...user._doc,
        id: user.id,
        token: generateToken(user._doc),
        createdAt: new Date(user._doc.createdAt).toISOString()
      }
    }, // End of login function
  }
}
